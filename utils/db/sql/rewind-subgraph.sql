create or replace function
  rewind_subgraph(sid varchar, block integer, block_hash varchar)
returns void as
$$
declare
  sgd varchar;
  sgd_version varchar;
  tbl varchar;
begin
  -- Get name of database schema for subgraph
  select name, version
    into sgd, sgd_version
    from deployment_schemas
   where subgraph = sid;

  if sgd_version != 'relational' then
    raise notice 'Subgraph % can not be rewound since it does not use relational storage',
                 sid;
    return;
  end if;

  raise notice 'Rewinding subgraph %(%)', sgd, sid;

  -- Rewinding dynamic data sources. We do not need to do the 'update ..'
  -- part of rewinding that we need for general data since versioned
  -- metadata is never changed, only created and there are therefore no
  -- metadata entries whose upper(block_range) is finite
  raise notice '  - Rewinding dynamic data sources';
  with dds as (
    select * from subgraphs.dynamic_ethereum_contract_data_source
              where deployment = sid),
   del_ethereum_block_handler_entity as (
      delete from subgraphs.ethereum_block_handler_entity
                         where lower(block_range) > block
                           and id in (select id from dds)),
   del_ethereum_block_handler_filter_entity as (
      delete from subgraphs.ethereum_block_handler_filter_entity
                         where lower(block_range) > block
                           and id in (select id from dds)),
   del_ethereum_call_handler_entity as (
      delete from subgraphs.ethereum_call_handler_entity
                         where lower(block_range) > block
                           and id in (select id from dds)),
   del_ethereum_contract_abi as (
      delete from subgraphs.ethereum_contract_abi
                         where lower(block_range) > block
                           and id in (select id from dds)),
   del_ethereum_contract_data_source as (
      delete from subgraphs.ethereum_contract_data_source
                         where lower(block_range) > block
                           and id in (select id from dds)),
   del_ethereum_contract_data_source_template as (
      delete from subgraphs.ethereum_contract_data_source_template
                         where lower(block_range) > block
                           and id in (select id from dds)),
   del_ethereum_contract_data_source_template_source as (
      delete from subgraphs.ethereum_contract_data_source_template_source
                         where lower(block_range) > block
                           and id in (select id from dds)),
   del_ethereum_contract_event_handler as (
      delete from subgraphs.ethereum_contract_event_handler
                         where lower(block_range) > block
                           and id in (select id from dds)),
   del_ethereum_contract_mapping as (
      delete from subgraphs.ethereum_contract_mapping
                         where lower(block_range) > block
                           and id in (select id from dds)),
   del_ethereum_contract_source as (
      delete from subgraphs.ethereum_contract_source
                         where lower(block_range) > block
                           and id in (select id from dds))
  delete from subgraphs.dynamic_ethereum_contract_data_source
                   where lower(block_range) > block
                     and deployment = sid;

  -- Revert data in all tables. We get rid of everything that happened after
  -- `block` was processed, i.e. revert from `block+1` onwards
  for tbl in
    select table_name
      from information_schema.tables
     where table_schema = sgd
     order by table_name
  loop
    raise notice '  - Reverting entities in %.%', sgd, tbl;
    execute format('delete from %s.%s where lower(block_range) > %s',
                   sgd, tbl, block);
    execute format('update %s.%s
                       set block_range = int4range(lower(block_range), null)
                     where block_range @> %s
                       and not block_range @> 2147483647',
                   sgd, tbl, block);
  end loop;

  -- Rewind subgraph block pointer
  raise notice '  - Rewind block pointer';
  update subgraphs.subgraph_deployment
     set latest_ethereum_block_number = block,
         latest_ethereum_block_hash = decode(block_hash, 'hex')
   where id = sid
     and latest_ethereum_block_number > block;
end;
$$ language plpgsql;

create or replace function
  rewind_all(net varchar, block_nr integer, block_hash varchar)
returns void as
$$
begin
  perform rewind_subgraph(id, block_nr, block_hash)
     from subgraphs.subgraph_deployment_detail
    where network = net
      and latest_ethereum_block_number > block;

  raise notice 'Updating head block pointer';
  update ethereum_networks
     set head_block_hash = block_hash,
         head_block_number = block_nr
   where name = net;

  raise notice 'Removing blocks from the future';
  delete from ethereum_blocks
   where number > block_nr
     and network_name = net;
end;
$$ language plpgsql;
