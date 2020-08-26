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
  # Using 'n2d-standard-4' is really preferrable here, since they are
  # faster machines for the same price, but many people report that
  # they do not have quote for that in GCP, and that getting the
  # quote raised can be very difficult with GCP support
  default = "n1-standard-4"
  description = "The type of machine to use for kubernetes nodes"
}

# Possible values are listed at
# https://cloud.google.com/sql/docs/postgres/create-instance
variable "database_tier" {
  type = string
  default = "db-custom-8-32768"
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

variable "indexer_mnemonic" {
  type = string
  description = "Mnemonic for the indexer's Ethereum private key"
}

# Temporary
variable "dockerhub_username" {
  type = string
  description = "DockerHub username"
}
variable "dockerhub_password" {
  type = string
  description = "DockerHub password"
}
variable "dockerhub_email" {
  type = string
  description = "DockerHub email"
}