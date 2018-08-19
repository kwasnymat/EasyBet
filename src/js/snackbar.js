const showSnackbar = (element) => {
    const snackBar = document.getElementById("snackbar");

    if (element === 'league'){
        snackBar.innerText = 'Brak dostępnych rozgrywek';
    } else if (element === 'match'){
        snackBar.innerText = 'Brak dostępnych spotkań';
    } else if(element === 'odd'){
        snackBar.innerText = 'Brak dostępnych kursów';
    }

    snackBar.className = "show";
    setTimeout(() => { snackBar.className = snackBar.className.replace("show", ""); }, 3000);

};

export {showSnackbar}