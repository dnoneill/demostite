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
{% assign years = events | map: "event_decade" | compact | uniq | sort %}
{% for year in years %}
<h2><b>{{year}}'s</b></h2>{% assign yearevents = events | where_exp: 'item', 'item.event_decade == year' %}
{% for events in yearevents %}
<div>
  	{{events.year}} - <a href="#/places/{{events.categories}}">{{events.title }}</a>
  </div>
	{% endfor %}
{% endfor %}
