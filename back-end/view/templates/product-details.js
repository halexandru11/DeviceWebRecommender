
    function addToWishlist() {
        const url = window.location.href;
        const index = url.indexOf('=');
        const character = url.charAt(index + 1);
        console.log(character); // Output: "2"
            
    }