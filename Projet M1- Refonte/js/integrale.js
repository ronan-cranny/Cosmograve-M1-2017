//formule utilis�e pour le calcul de l'age de l'univers
function fonction_integrale(x, omegam0, omegalambda0, Or){
	return (1./(1.+x)) * Math.pow(Or*Math.pow(1.+x, 4) + omegam0*Math.pow(1.+x, 3) - (omegalambda0 + Or + omegam0 - 1.)*Math.pow(1.+x, 2) + omegalambda0, -1./2);
}

//formule utilis�e pour le calcul de distance metrique
function fonction_dm(x, omegam0, omegalambda0, Or){
	return 1./Math.pow((Or*Math.pow((1.+x),4)+omegam0*Math.pow((1+x),3)+(1-Or-omegam0-omegalambda0)*Math.pow((1+x),2)+omegalambda0),(1./2.));
}

// pour calculer les omegas pour une valeur de z
function fonction_E(x,omegam0, omegalambda0, Or){return (Or*Math.pow(1.+x,4)+omegam0*Math.pow(1.+x,3)+(1-omegam0-omegalambda0-Or)*Math.pow(1.+x,2)+omegalambda0) ;}



//fonction de l'equation de simpson n = nombre de pas
function simpson(bornInf, bornSup, fonction, omegam0, omegalambda0, Or, eps){
	whole = inetgrate_area_simpson(bornInf, bornSup, fonction, omegam0, omegalambda0, Or);

    return recursive_asr(bornInf, bornSup, fonction, omegam0, omegalambda0, Or, eps, whole);
}

function inetgrate_area_simpson(bornInf, bornSup, fonction, omegam0, omegalambda0, Or){

	var centre = (bornInf+bornSup)/2.0;
	var h3 = Math.abs(bornSup-bornInf)/6.0;
	console.log(" fct" +fonction(bornSup,omegam0, omegalambda0, Or));
	return h3*(fonction(bornInf,omegam0, omegalambda0, Or) + 4.0*fonction(centre,omegam0, omegalambda0, Or) + fonction(bornSup,omegam0, omegalambda0, Or));

}

function recursive_asr(bornInf, bornSup, fonction, omegam0, omegalambda0, Or, eps,whole){
  var alerter = 0;
	var centre = (bornInf+bornSup)/2.0;
	var gauche =  inetgrate_area_simpson(bornInf, centre, fonction, omegam0, omegalambda0, Or);
	var droite =  inetgrate_area_simpson(centre, bornSup, fonction, omegam0, omegalambda0, Or);
	if (alerter===0){
  	if (Math.abs(gauche + droite - whole) <= 15* eps){
	  	return gauche + droite + (gauche + droite - whole)/15.0;
	  }
  	else{
	    if (isNaN(gauche + droite)){
	     alerter = 1;
	    }
	   else{
	  	return recursive_asr(bornInf, centre, fonction, omegam0, omegalambda0, Or, eps/2.0,gauche) + recursive_asr(centre, bornSup, fonction, omegam0, omegalambda0, Or, eps/2.0,droite);
	    }
  	}
	}
	else{
	  return (1.0/0.0);
	}

}