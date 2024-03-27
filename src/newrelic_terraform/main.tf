resource "newrelic_one_dashboard_json" "basic_dashboard" {
     json = file("${path.module}/dashboard.json")
}

resource "newrelic_entity_tags" "basic_dashoard" {
	guid = newrelic_one_dashboard_json.basic_dashboard.guid
	tag {
    	     key    = "terraform"
    	     values = [true]
	}
}

output "basic_dashboard" {
      value = newrelic_one_dashboard_json.basic_dashboard.permalink
}