// Calculate View height


function calculateVH () {

    // console.log('calculate VH');

	var vh = window.innerHeight * 0.01;

	// console.log(vh);
	document.documentElement.style.setProperty('--vh', vh + 'px');

	// console.log(vh);

}

export default calculateVH;