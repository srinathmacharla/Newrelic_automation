terraform {
  required_providers {
    newrelic = {
      source = "newrelic/newrelic"
      version = "3.27.2"
    }
  }
}

provider "newrelic" {
  account_id = "4339676"
  api_key = "NRAK-RHZ8ZGCZ79CD4H5J373GNGZ9BQ3"
  region = "US"
}