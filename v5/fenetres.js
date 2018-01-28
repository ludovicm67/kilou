var zindex=0;
var idfenetre=0;
var fenetre_deplacee=0;
var fenetre_deplacee_difx=0;
var fenetre_deplacee_dify=0;
var titrefenetre="(Sans Titre)";

function supprdivfenetre(idsuppr)
{
var id = idsuppr, // objet à supprimer
    noeud = document.getElementById(id).parentNode, // parent
    enfant = noeud.childNodes, // enfants
    longueur = enfant.length; // nombre enfants

for(i=0; i<longueur; i++){ // parcours enfants
	// si on trouve le bon id, et que ce n'est pas un node texte
	if(enfant[i].nodeType == 1 && enfant[i].id==id)
	{
		noeud.removeChild(enfant[i]);// le remove
		break;
	}
}
}

function creer_fenetre(left,top,width,height,frame,ntitre) {
	idfenetre++;  
var titrefenetre="(Sans Titre)";
if(ntitre == 0) titrefenetre="TERMINAL";
if(ntitre == 1) titrefenetre="Bienvenue dans KILOU5 !";
if(ntitre == 2) titrefenetre="Ceci est le titre de cette fenetre de test =D";
if(ntitre == 3) titrefenetre="Calculatrice";
	this.frame = frame;
        var fenetre = document.createElement("div");
        fenetre.className="fenetre"; //On donne un attribut class à cette div
	fenetre.id=idfenetre;
        fenetre.style.left=left+"px"; //Modification de l'attribut left du style de notre div
        fenetre.style.top=top+"px";
        fenetre.style.width=width+"px";
        fenetre.style.height=height+"px";
	var hauteurframe = height+"px";
	var largeurframe = width+"px";



		addEvent(fenetre,"mousedown",function (){premier_plan(fenetre)});
       
        //On créé de la même manière la div "haut":
        var haut = document.createElement("div");
        haut.className="haut";
		addEvent(haut,"mousedown",function (event){commencer_deplacement(event,fenetre)});
		addEvent(haut,"mouseup",arreter_deplacement);
        //On créé ensuite les trois div qui seront dedans:
        var haut_gauche = document.createElement("div");
        haut_gauche.className="haut_gauche";
        var haut_droite = document.createElement("div");
        haut_droite.className="haut_droite";
        var haut_centre = document.createElement("div");
        haut_centre.className="haut_centre";
	haut_centre.innerHTML=titrefenetre+" <img src=\"icon/cross.png\" style=\"float:right;margin-top:3px;\" onclick=\"supprdivfenetre("+idfenetre+")\" />";
        //Puis on les insère une par une dans notre bloc "haut":
        haut.appendChild(haut_gauche);
        haut.appendChild(haut_droite);
        haut.appendChild(haut_centre);
        //On insère le tout (la div "haut" et les trois div à l'intérieur) dans le bloc "fenetre":
        fenetre.appendChild(haut);
       
        //On fait de même pour la div "milieu"
        var milieu = document.createElement("div");
        milieu.className="milieu";
        var milieu_gauche = document.createElement("div");
        milieu_gauche.className="milieu_gauche";
        var milieu_droite = document.createElement("div");
        milieu_droite.className="milieu_droite";
        var milieu_centre = document.createElement("div");
        milieu_centre.className="milieu_centre";
	milieu_centre.innerHTML="<iframe name=\"FRAME\" SRC=\"html/"+frame+".html\" scrolling=\"no\" height=\""+hauteurframe+"\" width=\""+largeurframe+"\" FRAMEBORDER=\"no\"></iframe>";
        milieu.appendChild(milieu_gauche);
        milieu.appendChild(milieu_droite);
        milieu.appendChild(milieu_centre);
        fenetre.appendChild(milieu);
       
        //On fait de même pour la div "bas
        var bas = document.createElement("div");
        bas.className="bas";
        var bas_gauche = document.createElement("div");
        bas_gauche.className="bas_gauche";
        var bas_droite = document.createElement("div");
        bas_droite.className="bas_droite";
        var bas_centre = document.createElement("div");
        bas_centre.className="bas_centre";
        bas.appendChild(bas_gauche);
        bas.appendChild(bas_droite);
        bas.appendChild(bas_centre);
        fenetre.appendChild(bas);

		premier_plan(fenetre); //On met au premier plan notre fenêtre
        document.body.appendChild(fenetre); //On insère le tout dans notre document, dans le corps
}


function premier_plan(fenetre) {
        zindex++; //On incrémente la variable globale
        fenetre.style.zIndex=zindex; //On affecte sa valeur au z-index de la fenetre concernée
}

function commencer_deplacement(ev,fenetre) {
        fenetre_deplacee=fenetre; //On défini quelle fenêtre est en cours de déplacement
        old_mouseCoords=mouseCoords(ev); //On récupère la position de la souris
        old_windowCoords=getPosition(fenetre); //Et la position de notre fenêtre
        //On stocke les différences dans les variables globales
        fenetre_deplacee_difx=old_mouseCoords.x-old_windowCoords.x;
        fenetre_deplacee_dify=old_mouseCoords.y-old_windowCoords.y;
}
function arreter_deplacement() {
        fenetre_deplacee=0; //La variable vaut 0
}

function deplacer_fenetre(ev) {
        if(fenetre_deplacee!=0) {
                var souris=mouseCoords(ev);
                fenetre_deplacee.style.left=(souris.x-fenetre_deplacee_difx)+'px'; //On soustrait l'abscisse du curseur par rapport au coin gauche de la fenêtr
                fenetre_deplacee.style.top=(souris.y-fenetre_deplacee_dify)+'px'; //On fait de même avec l'ordonnée
        }
}

function addEvent(obj,event,fct){
     if(obj.attachEvent)
        obj.attachEvent('on' + event,fct);
     else
        obj.addEventListener(event,fct,true);
}

function commencer_deplacement(ev,fenetre) {
        fenetre_deplacee=fenetre; //On défini quelle fenêtre est en cours de déplacement
        old_mouseCoords=mouseCoords(ev); //On récupère la position de la souris
        old_windowCoords=getPosition(fenetre); //Et la position de notre fenêtre
        //On stocke les différences dans les variables globales
        fenetre_deplacee_difx=old_mouseCoords.x-old_windowCoords.x;
        fenetre_deplacee_dify=old_mouseCoords.y-old_windowCoords.y;
}

function mouseCoords(ev){
        if(ev.pageX || ev.pageY){
                return {x:ev.pageX, y:ev.pageY};
        }
        return {
                x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
                y:ev.clientY + document.body.scrollTop  - document.body.clientTop
        };
}

function getPosition(e){
        var left = 0;
        var top  = 0;
        while (e.offsetParent){
                left += e.offsetLeft;
                top  += e.offsetTop;
                e     = e.offsetParent;
        }
        left += e.offsetLeft;
        top  += e.offsetTop;
        return {x:left, y:top};
}