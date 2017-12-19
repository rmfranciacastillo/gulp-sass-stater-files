var mobileMenu = document.getElementById('mobile-menu');
var mobileOpen = document.getElementById('mobile-open');
var mobileClose = document.getElementById('mobile-close');

mobileOpen.addEventListener('click', function(){
	mobileMenu.classList.add('open'); 	
});

mobileClose.addEventListener('click', function(){
	mobileMenu.classList.remove('open');
});

