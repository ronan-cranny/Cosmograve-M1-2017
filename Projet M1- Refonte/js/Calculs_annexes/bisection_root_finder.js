/*                                                      ---------------------  CALCULS INVERSES POUR LE DM ------------------------------------                            */

//executing function
function inverse(){
	get_root_dm();
	get_root_t();
}





function get_root_dm(){
	//récupère les constants nécessaires pour les calculs
	
	//recuperation des valeurs
	c = Number(document.getElementById("c_p").value);
	G = Number(document.getElementById("G_p").value);
	h = Number(document.getElementById("h_p").value);
	k = Number(document.getElementById("k_p").value);
	typeannee = document.getElementById("typeannee").value;
	nbr_precision = document.getElementById("nbr_precision").value;
	t0 = Number(document.getElementById("T0_annexes").value);
	h0 = Number(document.getElementById("H0_annexes").value); 
	omegam0 = Number(document.getElementById("omegam0_annexes").value);
	omegalambda0 = Number(document.getElementById("omegalambda0_annexes").value);
	omegalambda0 = omegalambda0.toExponential();

	//definition du type d'annee
	if(typeannee == "Sidérale"){
		nbrjours = 365.256363051;
		}else if(typeannee == "Julienne"){
		nbrjours = 365.25;
		}else if(typeannee == "Tropique (2000)"){
		nbrjours = 365.242190517;
		}else{
		nbrjours = 365.2425;
	}
	
	Eps = 0.00001;

	//calcul de h0 par secondes et par gigaannees
	au = 149597870700;
	H0parsec = h0*1000/((au*(180*3600))/Math.PI*Math.pow(10, 6));
	H0parsec = H0parsec;
	H0enannee = H0parsec*(3600*24*nbrjours);
	H0engannee = H0enannee*Math.pow(10, 9);
	
	
	Or = 0;
	if (document.getElementById("resultat_omegar0_annexes").options[2].selected) {
		sigma = (2*Math.pow(Math.PI, 5)*Math.pow(k, 4))/(15*Math.pow(h, 3)*Math.pow(c, 2));
		rho_r = (4*sigma*Math.pow(t0, 4))/(Math.pow(c, 3));
		Or =(8*Math.PI*G*rho_r)/(3*Math.pow(H0parsec, 2));
		Or=1.68*Or;
		Or = Or.toExponential();
		} else if (document.getElementById("resultat_omegar0_annexes").options[1].selected) {
		sigma = (2*Math.pow(Math.PI, 5)*Math.pow(k, 4))/(15*Math.pow(h, 3)*Math.pow(c, 2));
		rho_r = (4*sigma*Math.pow(t0, 4))/(Math.pow(c, 3));
		Or =(8*Math.PI*G*rho_r)/(3*Math.pow(H0parsec, 2));
		Or = Or.toExponential();
		} else {
	}
	eps = 0.00001;                                                              //tolérance d'érreur de l'intégral
	
	
	dm = document.getElementById("dm_racine_dm").value;
	z = bisection_method_dm(dm, omegam0, omegalambda0, Or, eps);
	document.getElementById("z_racine_dm").innerHTML= z;
	
}

function bisection_method_dm (dm, omegam0, omegalambda0, Or, eps){
	
	omegak0=(1-omegam0-omegalambda0-Or);
	f_x = formule_z(omegak0);
	za = 0;
	zb = 1e8;
	ex = 0.00001; //indicateur de tolérence d'erreur de l'interpolation/dichotomie

	dm_za = f_x(za, omegam0, omegalambda0, Or, eps); 
	dm_zb = f_x(zb, omegam0, omegalambda0, Or, eps);
	
	if (omegak0 <=0){
		while (dm > dm_zb){
			zb = zb*10;
			dm_zb = f_x(zb, omegam0, omegalambda0, Or, eps);
		}
		Z = dichotomie(za, zb, f_x, dm, ex);
		return Z;
	}
	//la condition de else est omegak0 >0
	else{
		//amplitude A de la fonction composée de sin(integral)       Sk_sin_x
		A = (c/(H0parsec*Math.sqrt( Math.abs(omegak0) )))
		if (dm > A){
			return NaN;  
		}
		integB = Math.sqrt( Math.abs(omegak0)) * simpson(0, zb, fonction_dm, omegam0, Number(omegalambda0), Number(Or), eps);
		//dans ce cas sin(integrale) montone sur l'intervalle [za; zb] 
		if (integB<Math.PI/2){
			//on vérifie que dm n'est pas supérieur à dm_zb car dm_zb< A   ici l'integral du dm_zb est dans [0;PI/2]
			if (dm > dm_zb){
				return NaN;  
			}
			return dichotomie(za, zb, f_x, dm, ex);
		}
		else if((integB>Math.PI/2) && (integB<Math.PI)){
			z_Pi_div_2 = dichotomie (za, zb, Integral_dm, Math.PI/2, ex);
			z_sol_1 = dichotomie (0, z_Pi_div_2, f_x, dm, ex);
			if (dm>dm_zb){
				z_sol_2 = dichotomie (z_Pi_div_2, zb, f_x, dm, ex);
				return z_sol_1+", " + z_sol_2;
			}
			return z_sol_1;
		}
		else{
			z_Pi_div_2 = dichotomie (za, zb, Integral_dm, Math.PI/2, ex);
			z_Pi = dichotomie (za, zb, Integral_dm, Math.PI, ex);
			z_sol_1 = dichotomie (0, z_Pi_div_1, f_x, dm, ex);
			z_sol_2 = dichotomie (z_Pi_div_1, z_Pi, f_x, dm, ex);
			return z_sol_1+", " + z_sol_2;
		}
	}
}



//												outil mathématique fondamental:   DICHOTOMIE  POUR "DM" 
function dichotomie(BornInf, BornSup, fonction, cible, ex){
	za = BornInf;
	zb = BornSup;
	dm_za = fonction(za, omegam0, omegalambda0, Or, eps); 
	dm_zb = fonction(zb, omegam0, omegalambda0, Or, eps);
	while (true){
			
			zc = (za+zb)/2.0;
			
			dm_zc = fonction(zc, omegam0, omegalambda0, Or, eps);
			if (((zb-za)/2)<ex){
				if ((zc/ex) < 3){
					ex = ex*1e-5;
				}
				else{
					zc = zc.toExponential(3);
					return zc;
				}
			}
			else if ((dm_zc-cible)*(dm_zb-cible)< 0){
				za = zc;
				dm_za = dm_zc;
			}
			else{
				zb = zc;
				dm_zb = dm_zc;
			}
		}
}


//fonction définit du produit de  l'intégral de la fonction "fonction_dm" avec abs(omegak0)^0.5   Ceci sert à trouver le z correspondant a pi/2 ou pi pour cette fonction

function Integral_dm(bornSup, omegam0, omegalambda0, Or, eps){
	 integ = Math.sqrt( Math.abs(omegak0)) * simpson(0, bornSup, fonction_dm, omegam0, Number(omegalambda0), Number(Or), eps);
}











//formules pour dm basé sur omegak0
function Sk_sin_x(bornSup, omegam0, omegalambda0, Or, eps){
	
    integ = Math.sqrt( Math.abs(omegak0)) * simpson(0, bornSup, fonction_dm, omegam0, Number(omegalambda0), Number(Or), eps);
    return (c/(H0parsec*Math.sqrt( Math.abs(omegak0) ))) * Math.sin(integ);
  }
  
function Sk_x(bornSup, omegam0, omegalambda0, Or, eps){
    return (c/(H0parsec) * simpson(0, bornSup, fonction_dm, omegam0, Number(omegalambda0), Number(Or), eps));
  }

function Sk_sinh_x(bornSup, omegam0, omegalambda0, Or, eps){
	
    integ = Math.sqrt( Math.abs(omegak0)) * simpson(0, bornSup, fonction_dm, omegam0, Number(omegalambda0), Number(Or), eps);
    return (c/(H0parsec*Math.sqrt( Math.abs(omegak0) ))) * Math.sinh(integ);
  }


  
  
//choix de la formule pour calculer dm
function formule_z(omegak0){
		//d騁ermine les formules qui sont utilent pour la distance metrique, omegak positif 0 ou negatif
	if (omegak0>0){
	  return Sk_sin_x;
      
		}
	else if (omegak0===0){
	  return Sk_x;

		}
	else{
	  return Sk_sinh_x;
	}
}
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------*/


/*                                                      ---------------------  CALCULS INVERSES POUR LE TEMPS  ------------------------------------            */






//########### DICHOTOMIE     outil mathématique fondamental:   DICHOTOMIE  POUR "T"   zc varie et le choix de la fonction_integrale dépend de la valeur z


function dichotomie_t(BornInf, BornSup, cible, ext, type){
	za = BornInf;
	zb = BornSup;
	
	//foncttions correspondantes aux z
	f_za = formule_t(za, omegam0, omegalambda0, Or, type);
	f_zb = formule_t(zb, omegam0, omegalambda0, Or, type);
	
	t_za = f_za(za, omegam0, omegalambda0, Or, eps); 
	t_zb = f_zb(zb, omegam0, omegalambda0, Or, eps);
	while (true){
			
			zc = (za+zb)/2.0;
			f_zc = formule_t(zc, omegam0, omegalambda0, Or, type);
			t_zc = f_zc(zc, omegam0, omegalambda0, Or, eps);
			alert("z: " +zc + "   t_zc: " + t_zc + "   zb-za" + (zb-za));
			if (((zb-za)/2)<ext){
				if ((zc/ext)<10){
					ext = ext*1e-5;
				}
				else{
					zc = zc.toExponential(3);
					return zc;
				}
			}
			else if ((t_zc-cible)*(t_zb-cible)< 0){
				za = zc;
				t_za = t_zc;
			}
			else{
				zb = zc;
				t_zb = t_zc;
			}
		}
}





//#######################################     GET_ROOT_T fonction suprême qui ordonne le calcul inverse. récupère les paramètres de la page HTML Calculs


function get_root_t(){
	au=149597870700;
	c = Number(document.getElementById("c_p").value);
	G = Number(document.getElementById("G_p").value);
	h = Number(document.getElementById("h_p").value);
	k = Number(document.getElementById("k_p").value);
	h0 = Number(document.getElementById("H0_annexes").value); 
	omegam0 = Number(document.getElementById("omegam0_annexes").value);
	omegalambda0 = Number(document.getElementById("omegalambda0_annexes").value);
	omegalambda0 = omegalambda0.toExponential();
	H0parsec = h0*1000/((au*(180*3600))/Math.PI*Math.pow(10, 6));
	eps = 0.0000001;                                                              //tolérance d'érreur de l'intégral
	Or = 0;
	
	t_em = (document.getElementById("t_racine_em").value)*H0parsec;
	z_em = bisection_method_t(t_em, omegam0, omegalambda0, Or, eps, 0);
	document.getElementById("z_racine_t_em").innerHTML= z_em;
	
	t_rec = (document.getElementById("t_racine_rec").value)*H0parsec;
	z_rec = bisection_method_t(t_rec, omegam0, omegalambda0, Or, eps, 1);
	document.getElementById("z_racine_t_rec").innerHTML= z_rec;
}




//#######################################     BISECTION_METHOD_T prépare les variables et mène des vérifications nécessaires avant de lancer l'algorithme de dicothomie



function bisection_method_t (t, omegam0, omegalambda0, Or, eps, type){
	omegak0=(1-omegam0-omegalambda0-Or);
	var za = 0;
	var zb = 5e6; //valeur par default
	ext = 0.00000000001; //indicateur de tolérence d'erreur dichotomie temporelle
	
	f_x_zb = formule_t(zb, omegam0, omegalambda0, Or, eps);
	t_zb = f_x_zb(zb, omegam0, omegalambda0, Or, eps);
	
	f_x_za = formule_t(za, omegam0, omegalambda0, Or, eps);
	t_za = f_x_za(za, omegam0, omegalambda0, Or, eps);
	
	//uncalculable signale si le calcul inverse est impossible. Sa fonction associé regulator ajuste l'intervalle où la solution peut se trouver
	uncalculable = regulator(t, omegam0, omegalambda0, Or);
	if (uncalculable){
		return NaN;
	}
	
	return dichotomie_t(za, zb, t, ext, type);
}




//#########################################################         FORMULE_T  choisit la fonction correspondante aux paramètres omegas et z récupérés de la page html


function formule_t(z, omegam0, omegalambda0, Or, type){
	if(Or > 0){ 
		//preparation des indicateurs pour mener au bon choix du fonction
		w = 0;
		v = 0;
		Om0=1./omegam0-1.;
	
		if(omegam0 <= 0.5){
			w=(1./3.)*Math.log(Om0+Math.sqrt(Om0*Om0-1.0));
			Olambdalim=4.*omegam0*Math.cosh(w)*Math.cosh(w)*Math.cosh(w);
		}
		else{
			v =(1./3.)*Math.acos(Om0);
			Olambdalim=4.*omegam0*Math.cos(v)*Math.cos(v)*Math.cos(v);
		}
		
		
		if(z <= 5e6){  
			if(omegalambda0 >= Olambdalim && type===1) {
				return Or_rec_z_inf_omlambda_sup;
			}
			else if(omegalambda0 >= Olambdalim && type===0){
				return Or_emi_z_inf_omlambda_sup;
			}
			else{
				return Or_z_inf_omlambda_inf;
			}
		}
		else{
			if(omegalambda0 >= Olambdalim) {
				return Or_z_sup_omlambda_sup;
			}
			else{
				return Or_z_sup_omlambda_inf;
			}
		}
	}
 
 
 
	if(Or === 0 && omegam0 !== 0){  
		if(z <= 5e6){
			return T_Or_z_inf;
		}
		else{
			return T_Or_z_sup;
		}
	}

	if(Or === 0 && omegam0=== 0 && omegak0 !== 0){  
		if(z <= 5e6){
			return T_Or_omegam0_z_inf; 
		}
		else{
			return T_Or_omegam0_z_sup;
		}
	}
					  
	if(Or === 0 && omegam0=== 0 && omegak0 === 0){  
	  return T_Or_omegam0_omegak0;
	}		
}


//#########################################################         REGULATOR

/*cette fonction prend les paramètres et ajuste les intervalles dans les situations où celles-ci ne possèdent pas la solution recherché. La fonction
 déclare également lorsqu'il est véritablement impossible de calculer la solution (return "true")*/
 
function regulator(t, omegam0, omegalambda0, Or){

	//la fonction associé à ces paramètres est monotone décroissante za<zb --- t_za>t_zb
	if(Or === 0 && omegam0 !== 0){ 
		if (t>t_za || t===0 || t<0){
			return true;
		}
		//regulation de l'intervalle
		while (t< t_zb && t!==0){
			zb = zb*10;
			f_x_zb = formule_t(zb, omegam0, omegalambda0, Or, eps);
			t_zb = f_x_zb(zb, omegam0, omegalambda0, Or, eps);
		}
		return false;
	}
	
	
	//la fonction associé à ces paramètres est monotone décroissante za<zb --- t_za>t_zb
	else if(Or === 0 && omegam0=== 0 && omegak0 !== 0){
		if (t>t_za || t===0 || t<0){
			return true;
		}
		//regulation de l'intervalle
		while (t< t_zb && t!==0){
			zb = zb*10;
			f_x_zb = formule_t(zb, omegam0, omegalambda0, Or, eps);
			t_zb = f_x_zb(zb, omegam0, omegalambda0, Or, eps);
		}
		return false;
	}
	
	
	//la fonction associé à ces paramètres est monotone croissante za<zb --- t_za<t_zb
	else if(Or === 0 && omegam0=== 0 && omegak0 === 0){
		if (t<t_za || t===0 || t<0){
			return true;
		}
		//regulation de l'intervalle
		while (t > t_zb && t!==0){
			zb = zb*10;
			f_x_zb = formule_t(zb, omegam0, omegalambda0, Or, eps);
			t_zb = f_x_zb(zb, omegam0, omegalambda0, Or, eps);
		}
		return false;
	}
	
	
	// très complexe, regulation de l'intervalle associer aux fonctions utilisées pour Or>0
	if(Or > 0){ 
		//preparation des indicateurs pour mener au bon choix du fonction
		w = 0;
		v = 0;
		Om0=1./omegam0-1.;
	
		if(omegam0 <= 0.5){
			w=(1./3.)*Math.log(Om0+Math.sqrt(Om0*Om0-1.0));
			Olambdalim=4.*omegam0*Math.cosh(w)*Math.cosh(w)*Math.cosh(w);
		}
		else{
			v =(1./3.)*Math.acos(Om0);
			Olambdalim=4.*omegam0*Math.cos(v)*Math.cos(v)*Math.cos(v);
		}
		
		//la fonction associé à ces paramètres est monotone croissante za<zb --- t_za<t_zb
		if(omegalambda0 >= Olambdalim){
			return false                           //<----------------------------------à VOIR
		}
		
		
		//la fonction associé à ces paramètres est monotone décroissante za<zb --- t_za>t_zb
		else{
			if (t>t_za || t===0 || t<0){
			return true;
			}
			//regulation de l'intervalle
			while (t< t_zb && t!==0){
				zb = zb*10;
				f_x_zb = formule_t(zb, omegam0, omegalambda0, Or, eps);
				t_zb = f_x_zb(zb, omegam0, omegalambda0, Or, eps);
			}
			return false;
		}
	}
}







//########                 Boîte à Fonctions physiques


//liste des formes de la fonction pour les calculs de temps

function Or_rec_z_inf_omlambda_sup(z, omegam0, omegalambda0, Or, eps){
	return simpson(1/(1+z), 1, fonction_integrale,Number(Or), omegam0,Number(omegak0),Number(omegalambda0),eps) ;
}

function Or_emi_z_inf_omlambda_sup(z, omegam0, omegalambda0, Or, eps){
	return simpson(0, z, fonction_integrale, omegam0, Number(omegalambda0), Number(Or), eps);
}

function Or_z_inf_omlambda_inf(z, omegam0, omegalambda0, Or, eps){
	return simpson(Number(z), 5e6, fonction_integrale, omegam0, Number(omegalambda0), Number(Or), eps)+(1/(Math.pow(Or, 1/2)))*(1/(2*Math.pow(5e6, 2)));
}

function Or_z_sup_omlambda_sup(z, omegam0, omegalambda0, Or, eps){
	return tempsReception = simpson(0, 5e6, fonction_integrale, omegam0, Number(omegalambda0), Number(Or), eps)+0.5*(1/(Math.pow(Or, 1/2)))*(1/Math.pow(5e6,2)-1/Math.pow(z2,2));
}

function Or_z_sup_omlambda_inf(z, omegam0, omegalambda0, Or, eps){
	return (1/(Math.pow(Or, 1/2)))*(1/(2*Math.pow(z, 2)));   
}





function T_Or_z_inf(z, omegam0, omegalambda0, Or, eps){
  return simpson(Number(z), 5e6, fonction_integrale, omegam0, Number(omegalambda0), 0.0, eps)+(1/(Math.pow(omegam0, 1/2)))*(2/(3*Math.pow(5e6, 3/2)));
}

function T_Or_z_sup(z, omegam0, omegalambda0, Or, eps){
  return (1/(Math.pow(omegam0, 1/2)))*(2/(3*Math.pow(z, 3/2)));
}

function T_Or_omegam0_z_inf(z, omegam0, omegalambda0, Or, eps){
  return simpson(Number(z), 5e6, fonction_integrale, omegam0, Number(omegalambda0), 0.0, eps)+1/(Math.pow(omegak0, 1/2)*5e6);
}

function T_Or_omegam0_z_sup(z, omegam0, omegalambda0, Or, eps){
  return 1/(Math.pow(omegak0, 1/2)*z);
}

function T_Or_omegam0_omegak0(z, omegam0, omegalambda0, Or, eps){
  return Math.log(1+z)/Math.pow(Number(omegalambda0), 1/2);
}
