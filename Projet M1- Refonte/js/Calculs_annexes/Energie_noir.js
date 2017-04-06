
function calc_energie_noire() {

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
	Or = document.getElementById("resultat_omegar0_annexes").value;
	
	
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
	
	
	//calcul de omegak
	omegak0 = 1-Or-omegam0-omegalambda0;
	document.getElementById("resultat_omegak0_annexes").innerHTML = omegak0;
	alert(omegak0);
	omegade0 = omegalambda0;

	
	//Energie Noire
	w0 = Number(document.getElementById("w0").value);
	w1 = Number(document.getElementById("w1").value);
	
	
	alert("debut dm");
// dm ........................................................................
	z1 = 1e8;
	z2 = 1e8;
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
	if (omegak0>0){
		integ_1 = Math.sqrt( Math.abs(omegak0)) * simpson(0, Number(z1), Enoire, omegam0, Number(omegalambda0), Number(Or),Eps);
		integ_2 = Math.sqrt( Math.abs(omegak0)) * simpson(0, Number(z2), Enoire, omegam0, Number(omegalambda0), Number(Or),Eps);

		dm1=(c/(H0parsec*Math.sqrt( Math.abs(omegak0) ))) * Math.sin(integ_1);
		dm2=(c/(H0parsec*Math.sqrt( Math.abs(omegak0) ))) * Math.sin(integ_2);

		}else if (omegak0==0){

		dm1=(c/(H0parsec) * simpson(0, Number(z1), Enoire, omegam0, Number(omegalambda0), Number(Or),Eps));
		dm2=(c/(H0parsec) * simpson(0, Number(z2), Enoire, omegam0, Number(omegalambda0), Number(Or),Eps));
			alert(dm1);

		}else{

		integ_1 = Math.sqrt( Math.abs(omegak0)) * simpson(0, Number(z1), Enoire, omegam0, Number(omegalambda0), Number(Or),Eps);
		integ_2 = Math.sqrt( Math.abs(omegak0)) * simpson(0, Number(z2), Enoire, omegam0, Number(omegalambda0), Number(Or),Eps);
		
		dm1=(c/(H0parsec*Math.sqrt( Math.abs(omegak0) ))) * Math.sinh(integ_1);
		dm2=(c/(H0parsec*Math.sqrt( Math.abs(omegak0) ))) * Math.sinh(integ_2);
	}
	dm = dm2 - dm1;

	dda=dm1/(1+Number(z1));
	dl=dm*(1+(z2-z1));
	
	alert("fin dm");
// TEMPS ................................................
	w = 0;
	v = 0;
	Om0=1./omegam0-1.;
	
	if(omegam0 <= 0.5){
		w=(1./3.)*Math.log(Om0+Math.sqrt(Om0*Om0-1.0));
		Olambdalim=4.*omegam0*Math.cosh(w)*Math.cosh(w)*Math.cosh(w);
	}else{
		v =(1./3.)*Math.acos(Om0);
		Olambdalim=4.*omegam0*Math.cos(v)*Math.cos(v)*Math.cos(v);
	                  }



        if(Or > 0)      { 

        if(z2 <= 5e6){  
                     if(omegalambda0 >= Olambdalim) {
                     tempsReception = simpson(1/(1+z2), 1, temps_parcours,Number(Or), omegam0,Number(omegak0),Number(omegalambda0)) ;//<-----------------------------A  VOIR
                     }else{
		     tempsReception = simpson(Number(z2), 5e6, fonction_integrale_enoire, omegam0, Number(omegalambda0), Number(Or),Eps)+(1/(Math.pow(Or, 1/2)))*(1/(2*Math.pow(5e6, 2)))   };//<-----------------------
	}else{
                     if(omegalambda0 >= Olambdalim) {
                     tempsReception = simpson(0, 5e6, fonction_integrale_enoire, omegam0, Number(omegalambda0), Number(Or),Eps)+0.5*(1/(Math.pow(Or, 1/2)))*(1/Math.pow(5e6,2)-1/Math.pow(z2,2));//<-----------------------------
                     }else{
          	     tempsReception = (1/(Math.pow(Or, 1/2)))*(1/(2*Math.pow(z2, 2)))   };//<------------------------------
	}
	


        if(z1 <= 5e6){  
                     if(omegalambda0 >= Olambdalim) {
                     tempsEmission = simpson(0, z1, fonction_integrale_enoire, omegam0, Number(omegalambda0), Number(Or),Eps);//<-----------------------------
                     }else{
		     tempsEmission = simpson(Number(z1), 5e6, fonction_integrale_enoire	, omegam0, Number(omegalambda0), Number(Or),Eps)+(1/(Math.pow(Or, 1/2)))*(1/(2*Math.pow(5e6, 2)))   };//<-----------------------
	}else{
                     if(omegalambda0 >= Olambdalim) {
                     tempsEmission = simpson(0, 5e6, fonction_integrale_enoire, omegam0, Number(omegalambda0), Number(Or),Eps)+0.5*(1/(Math.pow(Or, 1/2)))*(1/Math.pow(5e6,2)-1/Math.pow(z1,2));//<-----------------------------
                     }else{
          	     tempsEmission = (1/(Math.pow(Or, 1/2)))*(1/(2*Math.pow(z1, 2)))   };//<------------------------------
	}

                        }
 


       if(Or == 0 && omegam0 != 0)      {  

        if(z2 <= 5e6){
		tempsReception = simpson(Number(z2), 5e6, fonction_integrale_enoire, omegam0, Number(omegalambda0), 0.,Eps)+(1/(Math.pow(omegam0, 1/2)))*(2/(3*Math.pow(5e6, 3/2)));//<-----------------------
	}else{
		tempsReception = (1/(Math.pow(omegam0, 1/2)))*(2/(3*Math.pow(z2, 3/2)));//<------------------------------
	}
	if(z1 <= 5e6){
		tempsEmission = simpson(Number(z1), 5e6, fonction_integrale_enoire, omegam0, Number(omegalambda0), 0.,Eps)+(1/(Math.pow(omegam0, 1/2)))*(2/(3*Math.pow(5e6, 3/2)));//<--------------------------
	}else{
		tempsEmission = (1/(Math.pow(omegam0, 1/2)))*(2/(3*Math.pow(z1, 3/2)));//<---------------------------------------
	}
                      }

     

        if(Or == 0 && omegam0== 0 && omegak0 != 0)      {  

        if(z2 <= 5e6){
		tempsReception = simpson(Number(z2), 5e6, fonction_integrale_enoire, omegam0, Number(omegalambda0), 0.,Eps)+1/(Math.pow(omegak0, 1/2)*5e6);//<-----------------------
	}else{
		tempsReception = 1/(Math.pow(omegak0, 1/2)*z2);//<------------------------------
	}
	if(z1 <= 5e6){
		tempsEmission = simpson(Number(z1), 5e6, fonction_integrale_enoire, omegam0, Number(omegalambda0), 0.,Eps)+1/(Math.pow(omegak0, 1/2)*5e6);//<--------------------------
	}else{
		tempsEmission = 1/(Math.pow(omegak0, 1/2)*z1);//<---------------------------------------
	}
                      }
					  
					  
	if(Or == 0 && omegam0== 0 && omegak0 == 0)      {  

       			tempsReception =Math.log(1+z2)/Math.pow(omegalambda0, 1/2) ;//<------------------------------
			    tempsEmission = Math.log(1+z1)/Math.pow(omegalambda0, 1/2);//<---------------------------------------
	            }				  



	tempsReception_sec = (1./H0parsec)*tempsReception;//<--------------------------
	tempsEmission_sec = (1./H0parsec)*tempsEmission;//<-----------------------
	
	tempsReception = (1./H0enannee)*tempsReception;//<-------------------------
	tempsEmission = (1./H0enannee)*tempsEmission;//<--------------------------
	
	agebetween = tempsReception - tempsEmission;
	agebetween_sec = tempsReception_sec - tempsEmission_sec;
	alert("fin");
	
		Tz1=t0*(1+Number(z1));
	Tz1 = Tz1.toExponential(nbr_precision);
	Omz1=omegam0*Math.pow(1+Number(z1),3)/Enoire_norm(Number(z1),omegam0, Number(omegalambda0), Or);
	Omz1 = Omz1.toExponential(nbr_precision);
	Olz1=Number(omegalambda0)/Enoire_norm(Number(z1),omegam0, Number(omegalambda0), Or);
	Olz1 = Olz1.toExponential(nbr_precision);
	Orz1=Or*Math.pow(1+Number(z1),4)/Enoire_norm(Number(z1),omegam0, Number(omegalambda0), Or);
	Orz1 = Orz1.toExponential(nbr_precision);
	Okz1=omegak0*Math.pow(1+Number(z1),2)/Enoire_norm(Number(z1),omegam0, Number(omegalambda0), Or);
	Okz1 = Okz1.toExponential(nbr_precision);
	Hz1=h0*Math.pow(Enoire_norm(Number(z1),omegam0, Number(omegalambda0), Or),0.5);
	Hz1 = Hz1.toExponential(nbr_precision);






//les distances sont positives
	dm = Math.abs(dm);
	dm1 = Math.abs(dm1);
	dm2 = Math.abs(dm2);
	
	dm_pc = dm*3.2407557442396*Math.pow(10,-17);
	dm1_pc = dm1*3.2407557442396*Math.pow(10,-17);
	dm2_pc = dm2*3.2407557442396*Math.pow(10,-17);
	
	//on ajuste le nombre de decimale apres la virgule
	if(dm != 0){
		dm = dm.toExponential(nbr_precision);
	}
	if(dm1 != 0){
		dm1 = dm1.toExponential(nbr_precision);
	}
	if(dm2 != 0){
		dm2 = dm2.toExponential(nbr_precision);
	}
	if(dm_pc != 0){
		dm_pc = dm_pc.toExponential(4);
	}
	if(dm1_pc != 0){
		dm1_pc = dm1_pc.toExponential(4);
	}
	if(dm2_pc != 0){
		dm2_pc = dm2_pc.toExponential(4);
	}
	
	if(agebetween != 0){
		agebetween = agebetween.toExponential(nbr_precision);
	}
	if(tempsReception != 0){
		tempsReception = tempsReception.toExponential(nbr_precision);
	}
	if(tempsEmission != 0){
		tempsEmission = tempsEmission.toExponential(nbr_precision);
	}
	if(agebetween_sec != 0){
		agebetween_sec = agebetween_sec.toExponential(nbr_precision);
	}
	if(tempsReception_sec != 0){
		tempsReception_sec = tempsReception_sec.toExponential(nbr_precision);
	}
	if(tempsEmission_sec != 0){
		tempsEmission_sec = tempsEmission_sec.toExponential(nbr_precision);
	}
	
	//on change les champs pour informer l'utilisateur des resultats trouvés

		
	document.getElementById("dm").innerHTML = dm;
	document.getElementById("dm1").innerHTML = dm1;
	document.getElementById("dm2").innerHTML = dm2;
	document.getElementById("dm_pc").innerHTML = dm_pc;
	document.getElementById("dm1_pc").innerHTML = dm1_pc;
	document.getElementById("dm2_pc").innerHTML = dm2_pc;
	document.getElementById("agebetween").innerHTML = agebetween;
	document.getElementById("tempsReception").innerHTML = tempsReception;
	document.getElementById("tempsEmission").innerHTML = tempsEmission;
	document.getElementById("agebetween_sec").innerHTML = agebetween_sec;
	document.getElementById("tempsReception_sec").innerHTML = tempsReception_sec;
	document.getElementById("tempsEmission_sec").innerHTML = tempsEmission_sec;
	document.getElementById("Tz1").innerHTML = Tz1;
	document.getElementById("Omz1").innerHTML = Omz1;
	document.getElementById("Olz1").innerHTML = Olz1;
	document.getElementById("Orz1").innerHTML = Orz1;
	document.getElementById("Okz1").innerHTML = Okz1;
	document.getElementById("Hz1").innerHTML = Hz1;
	alert("tamere");
}

// ENERGIE

function a() {
	alert(omegaDE(1));
}


function Enoire(x,omegam0, omegalambda0, Or) {
	omegak0 = 1-Or-omegalambda0-omegam0;
	f =omegaDE(x)*Ya(x)+ omegak0/(x*x) + omegam0/Math.pow(x,3) + Or/Math.pow(x,4); // OMEGADE0 ......;
	return 1/Math.pow(f,0.5);
}


function Enoire_norm(x,omegam0, omegalambda0, Or) {
	omegak0 = 1-Or-omegalambda0-omegam0;
	f = omegaDE(x)*Ya(x) + omegak0/(x*x) + omegam0/Math.pow(x,3) + Or/Math.pow(x,4); // OMEGADE0 ......;
	return f;
}
function fonction_integrale_enoire(x, omegam0, omegalambda0, Or){
	return (1.0/(1.0+x))*Enoire(x,omegam0,omegalambda0,Or);
}

// Ya(x)

function Ya(x){
	w0 = Number(document.getElementById("w0").value);
	w1 = Number(document.getElementById("w1").value);
	
	return Math.exp(-3*(w1+w0+1)*Math.log(x) -3*w1*(1-x));
}

function omegaDE(x){
	w0 = Number(document.getElementById("w0").value);
	w1 = Number(document.getElementById("w1").value);
	omegalambda0 = Number(document.getElementById("omegalambda0_annexes").value);
	if(w1==0 && w0==-1){
		return omegalambda0;
		
	}
	else {
		return Ya(x)*omegalambda0;
	}
}