resource "newrelic_one_dashboard_json" "Example_dashboard" {
	json = file("${path.module}/resources/dashboards/Example_dashboard.json")
}

resource "newrelic_entity_tags" "ecommerce_platform" {
	guid = newrelic_one_dashboard_json.Example_dashboard.guid
	tag {
		//TO DO: add the tags used un the dashboard generation
		key    = "terraform"
		values = [true]
	}
}





output "ecommerce_web" {
	value = newrelic_one_dashboard_json.Example_dashboard.permalink
}