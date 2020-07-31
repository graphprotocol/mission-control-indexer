#
# General setup of the Google Cloud Provider
#
variable "project" {
  type = string
  description = "The name of the Google Cloud Project in which resources will live"
}

variable "region" {
  type = string
  description = "The name of the Google Cloud region"
  default = "us-central1"
}

variable "zone" {
  type = string
  description = "The name of the Google Cloud zone"
  default = "us-central1-a"
}

#
# Indexer-specific parameters
#
variable "indexer" {
  type = string
  description = "A unique name for the indexer"
}

# Possible values are listed at
# https://cloud.google.com/compute/docs/machine-types
# For simplicity, this size is used for the three node pools (default,
# index, query) Load on the default pool is generally very light, and a
# smaller VM can be used there.
variable "machine_type" {
  type = string
  default = "n2d-standard-4"
  description = "The type of machine to use for kubernetes nodes"
}

# Possible values are listed at
# https://cloud.google.com/sql/docs/postgres/create-instance
variable "database_tier" {
  type = string
  default = "db-n1-standard-8"
  description = "The type of machine to use for the database"
}

variable "database_password" {
  type = string
  description = "The database password"
}

variable "sizes" {
  type = object({
    query_pool = number
    index_pool = number
    default_pool = number
  })
  default = {
    query_pool = 1
    index_pool = 1
    default_pool = 1
  }
  description = "The number of machines to put into each k8s node pool"
}

variable "prometheus_disk_size" {
  type = number
  default = 256
  description = "The size of the disk that stores monitoring data (in GB)"
}
