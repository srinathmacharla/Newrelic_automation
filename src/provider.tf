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
  api_key = "NRAK-KA5Z0R3Q4GVCOCJW5PYI9SJZS47"
  region = "US"
} 