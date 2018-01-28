///////////////
// COULEURS //
///////////////

//FENETRE
BCKGROUND		=	"#FFFFFF";	//Couleur de fond de la fenetre
BORDER			=	"#000000";	//Couleur de la bordure

//BANDEAU
B_BCKGROUND		=	"#0109FE";	//Couleur du bandeau
B_TEXT			=	"#FFFFFF";	//Couleur du titre

//BOUTTON "FERMER" & "REDUIRE"
B_B_BCKGROUND	= 	"#FFFFFF";	//Couleur de Fond des bouttons "Fermer" et "Réduire"
B_B_BORDER		= 	"#000000";	//Couleur de Bordure des bouttons "Fermer" et "Réduire"
B_B_TEXT		= 	"#000000";	//Couleur de Texte des bouttons "Fermer" et "Réduire"

//BOUTTON "FERMER" & "REDUIRE" ENFONCES
B_BD_BCKGROUND	= 	"#000000";	//Couleur de Fond des bouttons "Fermer" et "Réduire"
B_BD_BORDER		= 	"#FFFFFF";	//Couleur de Bordure des bouttons "Fermer" et "Réduire"
B_BD_TEXT		= 	"#FFFFFF";	//Couleur de Texte des bouttons "Fermer" et "Réduire"

//SCROLLBAR
SBDARKSHADOW	=	"#4f4f4f";	//scrollbarDarkShadowColor
SB3DLIGHT 		=	"#4f4f4f";	//scrollbar3dLightColor
SBARROW   		=	"#FFFFFF";	//scrollbarArrowColor
SBBARBASE		=	"#4f4f4f";	//scrollbarBaseColor
SBBARFACE		=	"#8f8f8f";	//scrollbarFaceColor
SBHIGHTLIGHT	=	"#FFFFFF";	//scrollbarHighlightColor
SBBARSHADOW		=	"#8f8f8f";	//scrollbarShadowColor
SBBARTRACK		=	"#FFFFFF";	//scrollbarTrackColor
	
//////////////
// OPTIONS //
//////////////

COMPORTEMENT_FERMETURE = "cache"; //Comportement en cas de clique sur le boutton "Fermer" ( 'cache' ou 'supprime' la fenêtre)
CONFIRME_FERMETURE = true; //Demande une confirmation ou non lors d'un clique sur le boutton "Fermer"

COTES_REDIMENSIONNEMENT = "all"; //Cotés de la fenetre redimenssionables, "classique" = bas et droite, "all" = tous

//////////////////
// CONSTANTES //
//////////////////

//Constantes utilisées pour créer un masque  qui va nous permettre de savoir dans quelle(s) direction(s) le redimenssionnement doit s'effectué.
RES_UP 		= 1;	//Redimenssionement vers le haut
RES_DOWN 	= 2;	//Redimenssionement vers le bas
RES_RIGHT	= 4;	//Redimenssionement vers la droite
RES_LEFT	= 8;	//Redimenssionement vers la gauche

RES_ZONE	= 8;	//Zone de redimenssionement autour des borure ( Défaut : + ou - 5px)

MIN_HEIGHT 	= 75;	//Hauteur minimal pour une fenetre
MIN_WIDTH 	= 75;	//Largeur minimal pour une fenetre

///////////////
// GLOBALES //
///////////////

//Position du curseur de la souris (Mis à jour par le fonction appelé lors de l'evenement "OnMouseMove" de document)
curX = 0;
curY = 0;

resize_direction = 0; //Direction(s) du redimenssionement
in_resize = false;

fenetre = null;	//La fenetre en cours de déplacement
fenetre_resize = null;	//La fenetre en cours de redimmenssionnement

is_ie = ! (navigator.appName == "Netscape"); //Internet Explorer ou Netscape ?


//////////////////
// EVENEMENTS //
//////////////////

//Et on active l'event "mousemove" pour récupérer les coordonnée de la souris au fur et à mesure
document.onmousemove = PdcDocumentOnMouseMove;
document.onmousedown = PdcDocumentOnMouseDown;
document.onmouseup = PdcDocumentOnMouseUp;
 
//Création d'un fenetre
function CreerPdcFenetre( titre, largeur, hauteur, posLeft, posTop, contenu ){
		
	//On créer un objet "Div" correspondant à notre fenetre
	var fenetre = document.createElement("div");   
	
	//Permet d'identifier une fenetre de façon à ne pas éffectuer d'action de redimensionnement sur un élément qui n'est pas une fenetre
	
	fenetre.id = "PdcFenetre";
	
	//On définit les propriétés de la fenetre
	
	//On définit la taille et on garde la taille par défaut
	fenetre.my_width = ((is_ie ? 4 : 0) + largeur); //+ 4 pour la bordure si IE, 0 si FF
	fenetre.style.width = fenetre.my_width +"px"; 
	
	fenetre.my_height = ((is_ie ? 24 : 20) + hauteur); //+24 pour la bordure et le bandeau si IE, + 20 si FF
	fenetre.style.height = fenetre.my_height + "px"; 
	
	//Position
	fenetre.style.position = "absolute";
	fenetre.style.left = posLeft + "px";
	fenetre.style.top = posTop + "px";
	
	//Bordure
	fenetre.style.border = "2px " + BORDER + " solid";
		
	//Couleur de fond pour avoir une fenetre non transparente
	fenetre.style.backgroundColor = BCKGROUND;
	
	//On créer notre bandeau
	bandeau = CreerPdcBandeau( titre, fenetre, largeur);
	
	//On ajoute notre bandeau à la fentre
	fenetre.appendChild( bandeau);
	
	//On garde une référence à noter bandeau
	fenetre.bandeau = bandeau;
		
		
	//On créer une div qui va accueillir notre contenu
	var div_contenu = document.createElement("div"); 
	
	//On met à la taille demandé
	div_contenu.style.width = largeur + "px";
	div_contenu.style.height = hauteur + "px";
	
	//Dans le cas ou le contenu est plus grand que la div qui l'accueil, on affiche des scrollbar
	div_contenu.style.overflow = "auto";
		
	//Mise au couleurs personnailisé des scrollbars
	div_contenu.style.scrollbarDarkShadowColor	=	SBDARKSHADOW;
	div_contenu.style.scrollbar3dLightColor		=	SB3DLIGHT;
	div_contenu.style.scrollbarArrowColor		=	SBARROW;
	div_contenu.style.scrollbarBaseColor		=	SBBARBASE;
	div_contenu.style.scrollbarFaceColor		=	SBBARFACE;
	div_contenu.style.scrollbarHighlightColor	=	SBHIGHTLIGHT;
	div_contenu.style.scrollbarShadowColor		=	SBBARSHADOW;
	div_contenu.style.scrollbarTrackColor		=	SBBARTRACK;
	
	
	
	//On garde une référence à notre contenu pour la réduction de la fenetre
	fenetre.contenu = div_contenu; 
	
	//On garde également une réference dans l'autre sens (référence à la fenetre dans contenu)
	div_contenu.my_fenetre = fenetre;
		
	//Si on a du contenu on l'ajoute à la fenetre
	if(	contenu != null ){
	
		//Objet
		if( typeof( contenu) == "object" ){
			div_contenu.appendChild( contenu);
			
		}
		//Ou string (par exemple : "<a href"..."> .. </a>"
		else{
		
			tmp = document.createElement("div");
			tmp.innerHTML = contenu;
			div_contenu.appendChild( tmp);			
		}
		
	}

	//On ajoute notre div à la fenetre
	fenetre.appendChild( div_contenu);
			
	//Par défaut la fenetre est en dessous lorsque qu'une fenetre est déplacé
	fenetre.style.zIndex = 1;

	//Met la fenetre au premier plan au moindre clique dessus.
	fenetre.onmousedown = pdcFenetreOnClick;
	
	//On ajoute notre fenetre à la page
	document.body.appendChild( fenetre);
		
	//et on retourne l'objet fenetre pour une utilisation éventuelle (réaffichage après fermeture par exemple)
	return fenetre;
}

//Fonction indépendante pour la création de l'objet bandeau
function CreerPdcBandeau( titre, fenetre, largeur){

	// VOIR A LA FIN DU FICHIER POUR LE CODE HTML DU BANDEAU
			
	var bandeau = document.createElement("table")
	
	bandeau.style.width = largeur + "px";
	bandeau.style.height = "20px";
	bandeau.style.backgroundColor = B_BCKGROUND;
	bandeau.style.cursor = "move";
	
	
	var bandeau_body = document.createElement("tbody")
		
	//Notre unique ligne du tableau...	
	var tr = document.createElement("tr");
	
	//On créer une case pour le texte du titre
	var td_titre = document.createElement("td");	
	td_titre.style.paddingTop = "0px";
	td_titre.style.paddingBottom = "0px";
	
	//On ajoute la gestion des évenements à notre bandeau
	
	//Lorsque l'utilisateur appui sur le bouton de la souris
	td_titre.onmousedown = PdcFenetreOnMouseDown;	
	
	//Lorsque l'utilisateur relache le bouton de la souris
	td_titre.onmouseup = PdcFenetreOnMouseUp;
	
	//Réduire / Agrandir la fenetre en cas de double clique sur le bandeau
	td_titre.ondblclick  = PdcOnDoubleClickReduire; 
	
	//On créer la Div qui va accueillir le titre
	var div = document.createElement("div")
	
	div.style.fontSize = "12";
	div.style.width = (largeur - 36) + "px"; //Largeur de la fenetre moins la taille de nos 2 bouttons ( 12 + 12) moins la taille de la bordure (2 + 2) moins la taille entre nos cellule (4 * 2) = .. 36 bien sûr ! :p
	div.style.overflow = "hidden"; //Ne pas agrandir la Div si le contenu est plus grand que sa taille
	div.style.color = B_TEXT;
	div.style.fontWeight = "bold";
	div.style.whiteSpace = "nowrap"; //Pas de retour à la ligne
		
	
	//Le texte du titre
	div.innerHTML += titre;
	
		
	
	//On créer une 2ième case pour notre tableau celle contenant le "boutton" pour réduire la fenetre
	var td_reduire = document.createElement("td");	
	
	td_reduire.style.padding = "0px"	
	td_reduire.style.backgroundColor = B_B_BCKGROUND;
	td_reduire.style.cursor = "pointer";
	td_reduire.style.width = "12px";
	td_reduire.style.height = "12px";
	td_reduire.style.border = "1px " + B_B_BORDER + " solid";
	td_reduire.style.fontSize = "10px";	
	td_reduire.style.fontWeight = "bold";
	td_reduire.style.color = B_B_TEXT;
	
	//On utilise les balise <center> car la propriété "text-align" ne fonctionne pas sous FF
	td_reduire.innerHTML = "<center>-</center>";
		
	td_reduire.onmousedown = PdcBouttonOnMouseDown; //Début du clique
	td_reduire.onmouseup = PdcBouttonOnMouseUpReduire; //Réduction de la fenetre
	td_reduire.onmouseout = PdcBouttonOnMouseOut; //Si l'utilisateur commence son clique puis sort du "boutton" pour annuler
		
		
	
	//On créer une 3ième case pour notre tableau celle contenant le "boutton" pour fermer la fenetre
	var td_fermer = document.createElement("td");	
	
	td_fermer.style.padding = "0px"	
	td_fermer.style.backgroundColor = B_B_BCKGROUND;
	td_fermer.style.cursor = "pointer";
	td_fermer.style.width = "12px";
	td_fermer.style.height = "12px";
	td_fermer.style.border = "1px " + B_B_BORDER + " solid";
	td_fermer.style.fontSize = "10px";	
	td_fermer.style.fontWeight = "bold";
	td_fermer.style.color = B_B_TEXT;
	
	//On utilise les balise <center> car la propriété "text-align" ne fonctionne pas sous FF
	td_fermer.innerHTML = "<center>X</center>";
	
	td_fermer.onmousedown = PdcBouttonOnMouseDown; //Début du clique
	td_fermer.onmouseup = PdcBouttonOnMouseUpFermer; //Fermeture de la fenetre
	td_fermer.onmouseout = PdcBouttonOnMouseOut; //Si l'utilisateur commence son clique puis sort du "boutton" pour annuler
		
	//On Emboîte tout ça....
		
	//On ajoute la div à notre case (TD)
	td_titre.appendChild( div);	
	//On ajoute la case "titre" à notre ligne
	tr.appendChild( td_titre);
	//On ajoute la case "réduire" à notre ligne
	tr.appendChild( td_reduire);
	//On ajoute la case "fermer" à notre ligne
	tr.appendChild( td_fermer);	
	//On ajoute notre ligne au corp du tableau	
	bandeau_body.appendChild( tr);	
	//On ajoute le corp au tableau au tableau
	bandeau.appendChild( bandeau_body);
	
	
	//On ajoute une référence à la fenetre (l'objet parent) pour les 3 elements du bandeau
	
	//Permet d'accèder à la fenetre à partir des 3 "objets" du bandeau ('boutton' + titre)
	td_titre.my_fenetre = fenetre;
	td_fermer.my_fenetre = fenetre;
	td_reduire.my_fenetre = fenetre;	

	bandeau.titre = div;
	
	return bandeau;
		
		
}

//Bandeau.OnMouseUp
function PdcFenetreOnMouseUp(){	
		
	//On remet notre fonction par défaut pour gérer le déplacement
	this.onmousedown = PdcFenetreOnMouseDown;	
		
	//Effet de transparence
	if( is_ie )
		this.my_fenetre.style.filter = "alpha(opacity=100);";	
	else
		this.my_fenetre.style.opacity = "1";
	
	//Plus de déplacement de fenetre en cours
	fenetre = null;
}

//Bandeau.OnMouseDown
function PdcFenetreOnMouseDown(e){
		
	maj_coordonnees( e);
	
	//On garde les coordonnée du pointeur par rapport à la fenetre
	this.my_fenetre.CurLastX = curX - this.my_fenetre.offsetLeft;
	this.my_fenetre.CurLastY = curY - this.my_fenetre.offsetTop;
		

	//On se met au dessus des autres fenetres lors du déplacement
	pdcSetFenetrePremierPlan( this.my_fenetre);
			
	//Effet de transparence
	if( is_ie )
		this.my_fenetre.style.filter = "alpha(opacity=80);";	
	else
		this.my_fenetre.style.opacity = "0.8";
	
	//On garde l'objet fenetre (du bandeau) qui correspond à la fenetre pour laquelle on gère le déplacement
	fenetre = this.my_fenetre;
	
	//Annulation de l'evenement pour éviter le surlignement
	return false;
}


//Fonction qui met à jour les coordonnées de la souris en fonction du type de navigateur
function maj_coordonnees(e){
	
	if( is_ie ){
		curX = event.clientX;
		curY = event.clientY;
	}
	else{
		curY = e.clientY;
		curX = e.clientX;
	}
}


//Enfoncement des boutton "réduire" et "fermer"
function PdcBouttonOnMouseDown(){
				
	this.style.border = "1px " + B_BD_BORDER + " inset";	
	
	this.style.backgroundColor = B_BD_BCKGROUND;
	this.style.color = B_BD_TEXT;
	
	//Annulation de l'evenement pour éviter le surlignement
	return false;
}

//Relache la souris sur le boutton "réduire" (On réduit la fenetre)
function PdcBouttonOnMouseUpReduire(){
	
	
	this.style.border = "1px " + B_B_BORDER + " solid";	
	
	this.style.backgroundColor = B_B_BCKGROUND;
	this.style.color = B_B_TEXT;
	
	if( this.my_fenetre.contenu.style.display == "none" ){
		this.my_fenetre.contenu.style.display = "block"; //On réaffiche le contenu						
		this.my_fenetre.style.height = this.my_fenetre.my_height + "px"; //et on met à jour la taille de la fenetre				
	}
	else{
		this.my_fenetre.contenu.style.display = "none";	//On cache le contenu
		this.my_fenetre.style.height = ( is_ie ? 24 : 20) + "px"; //Taille de la fenetre = taille du bandeau + bordure
	}
	
}

//Double click sur le bandeau (titre) (On réduit la fenetre)
function PdcOnDoubleClickReduire(){
			
	if( this.my_fenetre.contenu.style.display == "none" ){
		this.my_fenetre.contenu.style.display = "block"; //On réaffiche le contenu						
		this.my_fenetre.style.height = this.my_fenetre.my_height + "px"; //et on met à jour la taille de la fenetre				
	}
	else{
		this.my_fenetre.contenu.style.display = "none";	//On cache le contenu
		this.my_fenetre.style.height = ( is_ie ? 24 : 20) + "px"; //Taille de la fenetre = taille du bandeau + bordure
	}
	
	//Annulation de l'evenement pour éviter la selection
	return false;
}

//Relache la souris sur le boutton "fermer" (On ferme ou cache la fenetre)
function PdcBouttonOnMouseUpFermer(){
	
	this.style.border = "1px " + B_B_BORDER + " solid";	
	
	this.style.backgroundColor = B_B_BCKGROUND;
	this.style.color = B_B_TEXT;
	
	//Confirmation avant fermeture?
	if( CONFIRME_FERMETURE )
		if( !confirm("Etes-vous sûr de vouloir fermer la fenêtre?") )
			return;
	
	
	//Lors de la demande de fermeture soit on cache la fenetre
	if( COMPORTEMENT_FERMETURE == "cache"){
		this.my_fenetre.style.display = "none";
	}
	//Soit on l'enlève définitivement de notre page
	else{
		document.body.removeChild( this.my_fenetre);
	}
}

//sorti des boutton "réduire" et "fermer" pour la souris
function PdcBouttonOnMouseOut(){
		
	this.style.border = "1px " + B_B_BORDER + " solid";	
	
	this.style.backgroundColor = B_B_BCKGROUND;
	this.style.color = B_B_TEXT;	
}

//Document.OnMouseMove
function PdcDocumentOnMouseMove(e){
				
	//Déplacement
	if( fenetre != null ){
	
		maj_coordonnees(e);
		
		//On bloque le déplacement en dehors de la fenetre du navigateur
		if( curX - fenetre.CurLastX < 0 || curY -fenetre.CurLastY < 0 )
			return;
			
		//Déplace la fenetre en fonction de la position actuelle du curseur et de la position du curseur par rapport à la fenetre
		fenetre.style.left = curX -fenetre.CurLastX + "px";
		fenetre.style.top = curY - fenetre.CurLastY + "px";	
	}
	//Redimenssionnement
	else{
		
		
		if( fenetre_resize == null ){
		
			//On cherche à savoir si la souris est sur un element de Type "Fenetre" (class = "PdcFenetre")			
			if( is_ie ){
				if( event.srcElement.id != "PdcFenetre" )				
					return;									
			}
			else{
				
				if( e.target.id != "PdcFenetre")
					return;						
			}
						
			//La fenetre à redimenssioner
			if( is_ie )
				fenetre_resize = event.srcElement;
			else
				fenetre_resize = e.target;			
		}
				
		//On récupère la position de la souris par rapport à la fenetre
		if( is_ie ){						
			posX = event.clientX - fenetre_resize.offsetLeft;			
			posY = event.clientY - fenetre_resize.offsetTop;
			eX = event.clientX;
			eY = event.clientY;
		}
		else{			
			posX = e.clientX - fenetre_resize.offsetLeft;			
			posY = e.clientY - fenetre_resize.offsetTop;
			eX = e.clientX;
			eY = e.clientY;
		}
		
		//Pas de redimenssionnement en cours, on cherche à savoir dans quelle zone (direction) la souris se trouve
		if( ! in_resize ){
			
			//Aucune direction par défaut
			resize_direction = 0;
			
			//Type de curseur
			resize_cursor = "";
			
			//On cherche à savoir dans quelle(s) direction(s) doit on redimenssioner	
			if ( COTES_REDIMENSIONNEMENT == "all" && Math.abs(posY) < RES_ZONE){
				resize_direction += RES_UP;
				resize_cursor += "n";
			}
			else if( posY > (fenetre_resize.offsetHeight - RES_ZONE) && posY < (fenetre_resize.offsetHeight + RES_ZONE) ){
				resize_direction += RES_DOWN;
				resize_cursor += "s";
			}
			
			if( COTES_REDIMENSIONNEMENT == "all" && Math.abs(posX) < RES_ZONE ){
				resize_direction += RES_LEFT;
				resize_cursor += "w";
			}
			else if( posX > (fenetre_resize.offsetWidth - RES_ZONE) && posX < (fenetre_resize.offsetWidth + RES_ZONE) ){
				resize_direction += RES_RIGHT;
				resize_cursor += "e";			
			}
				
					

			//Si on est sorti de la zone de redimenssionement, on remet le curseur par défaut
			if( resize_direction == 0 ){
				
				fenetre_resize.style.cursor = "default";		
				document.body.style.cursor = "defaut";			
				fenetre_resize = null;
				
				return;
			}
			//Sinon on met le curseur qui va bien
			else{
				
								
				fenetre_resize.style.cursor = resize_cursor + "-resize";					
				//HS sous FF !
				document.body.style.cursor = resize_cursor + "-resize;";				
			}
			
			return;		
		}		
		//En cours de redimenssionement
		else{
		
		
 
						
			if( resize_direction & RES_RIGHT ){
				
				if( posX >= MIN_WIDTH){
					
					//Redimensionne la fenetre
					fenetre_resize.style.width = posX + "px";
					//Redimensionne le contenu
					fenetre_resize.contenu.style.width = (posX - (is_ie ? 4 : 0) ) + "px";					
					//Redimensionne le bandeau
					fenetre_resize.bandeau.style.width = (posX - (is_ie ? 4 : 0) ) + "px";										
					//Puis la div contenant le titre (taille fixe pour gestion de l'overflow)
					fenetre_resize.bandeau.titre.style.width = (posX - (is_ie ? 40 : 36) ) + "px";										
					
					//On garde en "mémoire" la nouvelle taille de la fenetre pour la réduction/agrandissement
					fenetre_resize.my_width = posX;
				}
			}
			
			if( resize_direction & RES_LEFT ){
				
				new_width = (fenetre_resize.offsetWidth - 4 - posX );
				
				if( new_width >= MIN_WIDTH){
					
					//Redimensionne le contenu
					fenetre_resize.contenu.style.width = new_width + "px";					
					//Redimensionne le bandeau
					fenetre_resize.bandeau.style.width = new_width + "px";										
					//Puis la div contenant le titre (taille fixe pour gestion de l'overflow)
					fenetre_resize.bandeau.titre.style.width = (new_width - 36 ) + "px";	
					
					//Déplace + Redimensionne la fenetre
					fenetre_resize.style.left = eX + "px";				
					fenetre_resize.style.width =  new_width + "px";
					
					//On garde en "mémoire" la nouvelle taille de la fenetre pour la réduction/agrandissement
					fenetre_resize.my_width = posX;
										
				}
				//Lorsqu'on à atteint la taillle minimal, on se contente de déplacer la fenetre
				else{
				
					//Déplace la fenetre
					fenetre_resize.style.left = eX + "px";				
				}
			}		
			
			if( resize_direction & RES_UP ){
				
				new_height = (fenetre_resize.offsetHeight - 4 - posY );
				
				if( new_height >= MIN_HEIGHT){
					
					//Redimenssionne le contenu
					fenetre_resize.contenu.style.height = (new_height - 20 ) + "px";
					
					//Redimenssionne et déplace la fenetre
					fenetre_resize.style.top = eY + "px";
					fenetre_resize.style.height =  new_height + "px";	

					//Si l'utilisateur redimenssione vers le bas et que la fenetre et en mode "réduite" on réaffiche le contenu
					if( fenetre_resize.contenu.style.display == "none" )
						fenetre_resize.contenu.style.display = "block"; 					
						
					//On garde en "mémoire" la nouvelle taille de la fenetre pour la réduction/agrandissement
					fenetre_resize.my_height = posY;
					
				}
				//Lorsqu'on à atteint la taillle minimal, on se contente de déplacer la fenetre
				else{
				
					//Déplace la fenetre
					fenetre_resize.style.top = eY + "px";				
				}
				
				
			}
			
			if( resize_direction & RES_DOWN ){			
				
				if( posY >= MIN_HEIGHT){	
					//Redimenssionne la fenetre
					fenetre_resize.style.height = posY + "px";					
					//Redimenssionne le contenu
					fenetre_resize.contenu.style.height = (posY - (is_ie ? 24 : 20) ) + "px";	

					//Si l'utilisateur redimenssione vers le bas et que la fenetre et en mode "réduite" on réaffiche le contenu
					if( fenetre_resize.contenu.style.display == "none" )
						fenetre_resize.contenu.style.display = "block"; 					
						
					//On garde en "mémoire" la nouvelle taille de la fenetre pour la réduction/agrandissement
					fenetre_resize.my_height = posY;
				}
				
			}			
		}			
	}
	
	//Annulation de l'evenement pour éviter le surlignement
	return false;
}


//Souris enfoncée sur Document (Début de redimenssionnement...?)
function PdcDocumentOnMouseDown(e){	
	in_resize = true;
	//On se met au dessus des autres fenetres lors du redimenssionement
	if( fenetre_resize != null )
		pdcSetFenetrePremierPlan( fenetre_resize);
	
}


//Souris relâchée sur Document (Fin de redimenssionnement)
function PdcDocumentOnMouseUp(e){
	in_resize = false;		
}

//Met la fenetre au premier plan lorsqu'on clique dessus
function pdcFenetreOnClick(){
	pdcSetFenetrePremierPlan( this);
}

//Permet de mettre une fenetre en premier plan par rapport au autres.
function pdcSetFenetrePremierPlan( fenetre ){
			
	//Pour IE on travail sur : document.body.children
	//Pour FF on travail sur : document.body.childNodes
	//my_child = ( is_ie ? document.body.children : document.body.childNodes );
	
	
	my_child = document.body.childNodes;
	
	//On met tout les objet de type "Fenetre" en zIndex=1 (par défaut) et celle démandé en zIndex=2	
	for( var i=0; i < my_child.length; i++){
		if( my_child[i].id == "PdcFenetre" )
			my_child[i].style.zIndex = 1;
	}
		
	fenetre.style.zIndex = 2;
}

/*

CODE HTML + STYLE POUR LE BANDEAU

<table style="width: 100px; background-Color: #0109FE; cursor: move;">	
<tr>


	<td style="padding-top: 0px; padding-bottom: 0px;">
		<div align="left" style="font-size: 12; width: 50px; overflow: hidden; color: #FFFFFF; font-weight:bold; white-space:nowrap;">Mon super titre</div>
	</td>
	
	<td style="padding:0px; background-Color: #FFFFFF; cursor: pointer; width:12px; height:12px; border:1px #000000 solid; font-size:10; text-align= center; font-weight:bold;"><center>-</center></td>

	<td style="padding:0px; background-Color: #FFFFFF; cursor: pointer; width:12px; height:12px; border:1px #000000 solid; font-size:10; text-align= center; font-weight:bold;"><center>X</center></td>
			
</tr>
</table>


*/