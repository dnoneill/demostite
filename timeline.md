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
{% assign sortedye = yearevents | sort: "year" %}
{% assign groupedye = yearevents | sort: "year" | group_by: "year" %}
{% for gye in groupedye %}
{% assign ev = gye.items | sort_natural: "title" %}
{% for events in ev %}
<div>
	{% assign post = site.posts | where_exp: "item", "item.events.first.categories == events.categories" %}
  	{{events.year}} - <a href="#{{post.first.url}}">{{events.title }}</a>
  </div>
	{% endfor %}
{% endfor %}
{% endfor %}
