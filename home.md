---
layout: page
title: "Commemorating African American History at NC State"
menutitle: "Home"
order: 1
---

{% assign first = site.posts | where_exp: 'item', 'item.order == 1' | first %}

Initially conceived as a human-guided walking tour about African-American history at NC State, and extended into a mobile tour available via this site. The Red, White &amp; Black (RWB) project is an innovative approach to engagement that fosters the use of library resources, enhances educational goals, and provides opportunities for innovative partnerships. It is a collaboration between the NCSU Libraries, the <a href="https://oied.ncsu.edu/aacc/">African American Cultural Center</a>, and the <a href="https://history.ncsu.edu/">Department of History</a> at NC State. RWB gives participants the chance to explore spaces on campus that have had significant impact on the lives of African-American students, faculty, alumni, and administrators.

For questions and/or feedback please email <a href="mailto:mgfragol@ncsu.edu">Marian Fragola</a>

<p class="start">
	<a type="button" href="#{{first.url}}">
		Start Tour <i class="far fa-play-circle"></i>
	</a>
</p>
