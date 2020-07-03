---
permalink: /events/
layout: page
menutitle: Timeline
title: Timeline of Featured Events
order: 4
---
{% assign events = '' | split: "" %}
{% for item in site.posts %}
{% for event in item.events %}
{% assign events = events | push: event %}
{% endfor %}
{% endfor %}
{% assign years = events | map: "year" | compact | uniq | sort %}
{% for year in years %}
<h2><b>{{year}}'s</b></h2>{% assign yearevents = events | where_exp: 'item', 'item.year == year' %}
{% for events in yearevents %}
<div>
  	{{events.year}} - {{events.title }}
  </div>
	{% endfor %}
{% endfor %}
