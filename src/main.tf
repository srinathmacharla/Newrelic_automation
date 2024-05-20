resource "newrelic_one_dashboard_json" "ecommerce_platform" {
	json = file("${path.module}/resources/dashboards/Ecommerce_Platform.json")
}

resource "newrelic_entity_tags" "ecommerce_platform" {
	guid = newrelic_one_dashboard_json.ecommerce_platform.guid
	tag {
		//TO DO: add the tags used un the dashboard generation
		key    = "terraform"
		values = [true]
	}
}

resource "newrelic_one_dashboard_json" "ecommerce_web" {
	json = file("${path.module}/resources/dashboards/Ecommerce_Web.json")
}

resource "newrelic_entity_tags" "ecommerce_web" {
	guid = newrelic_one_dashboard_json.ecommerce_web.guid
	tag {
		//TO DO: add the tags used un the dashboard generation
		key    = "terraform"
		values = [true]
	}
}

resource "newrelic_one_dashboard_json" "example_dashboard" {
	json = file("${path.module}/resources/dashboards/Example_dashboard.json")
}

resource "newrelic_entity_tags" "example_dashboard" {
	guid = newrelic_one_dashboard_json.example_dashboard.guid
	tag {
		//TO DO: add the tags used un the dashboard generation
		key    = "terraform"
		values = [true]
	}
}

output "ecommerce_web" {
	value = newrelic_one_dashboard_json.ecommerce_web.permalink
}