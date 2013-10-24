// Funktsioon kontrollib mis kategooria uudistega on tegu. Funktsioon tagastab vastava
// teema sektsiooni nimetuse, kuhu hiljem selle kategooria uudised kuvatakse.
// category_childs on järjend kategooriate nimetustest ühe <arr> alapunkti all
function determineBlockName(category_childs){
	// Vaatleme kõiki uudise kategooria nimetusi
	for (i=0; i < category_childs.length; i++){
		var categoryName = null;
		
		// Vaatame ainult juhtusid, kus kategooria on ümbritsetud "str" tag-i poolt
		if (category_childs[i].nodeName == "str"){
		
			// Leiame uudise kategooria
			categoryName = category_childs[i].childNodes[0].nodeValue;
			
			/* Kui kategooria nimi vastab ühele meie poolt määratud nimetusele,
			siis tagastame Teema ploki nimetuse kuhu alla hiljem info kuvame */
			if ( categoryName == "Cloud" ){
				return ("cloudBlock");
			}
			else if ( categoryName == "sales"){
				return("marketBlock");
			}
			else if ( categoryName == "Gadgets"){
				return("gadgetsBlock");
			}
			else if ( categoryName == "Blu-ray"){
				return("techBlock");
			}
		}	
	}
	// kui vaadeldud kategooria ei kuulu vaadeldavate hulka, siis
	// tagastame numbrilise väärtuse, mille abil saab hiljem
	// kontrollida, kas leiti vaste
	return 0;
}

// funktsioon kirjutab Teema plokki html uudise
function fill(block_name, title, descript, date, author, link){
		var blockhtml= "";
		var jsDate = new Date(date);
		var monthNames = [ "January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December" ];
		
		blockhtml += '<h3 class="newsHeading">' + title + '</h3>';
		blockhtml += '<p class="shortDescript">' + descript + '</p>';
		blockhtml += '<p class="newsFooter">' + monthNames[jsDate.getMonth()] + "  " +
					jsDate.getUTCDate()+" | " + "by "+ author + '</p>';
		blockhtml += '<p><a href="'+link+'" target="_blank">' +"Read more..." + '</a></p>';
		document.getElementById(block_name).innerHTML+=blockhtml;
}

//Analoogne funktsiooniga "fill". Kirjutab viimaste uudiste sektsiooni html kujul uudise
function fillLatest(block_name, title, descript, date, author){
		var blockhtml= "";
		var jsDate = new Date(date);
		var monthNames = [ "January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December" ];

		blockhtml +='<div style="float: left">';
		blockhtml +='<section class="dateSection" style="min-width: 50px float: left">';
		blockhtml +='<h3 class="month">'+ monthNames[jsDate.getMonth()]+'</h3>';
		blockhtml +='<h1 class=latestDate>'+ jsDate.getUTCDate()+'</h1>';
		blockhtml +='</section>';
		blockhtml +='<aside class="newsAside">';
		blockhtml +='<h1 class="latestTitle">'+title+'</h1>';
		blockhtml +='<p class="latestDescription">'+descript+'</p>';
		blockhtml +='</aside>';
		blockhtml +='<br>';
		blockhtml +='<br>';
		blockhtml +='</div>';


		document.getElementById(block_name).innerHTML+=blockhtml;
}
/* Funktsioon lisab kõige uuemad uudised, järjendisse
 funktsiooni argumentideks on 3 järjendit : "times" - kõige hilisemate uudiste aegade järjend
											"news" - kõige hilisemate uudiste järjend
											"xmlinfo" - vaadeldava uudise info järjend"*/
function updateLatestNews(times,news,xmlinfo){
	// Viime JSON kujul uudise kuupäeva millisekundite kujule
	xmlDate_ms = Date.parse(xmlinfo[2]);
	
	// Järjendi sorteerimiseks vajalikud ajutised muutujad
	var tempNews;
	var tempTime;

	/* Kontrollime, kas argumendina saadud uudise aeg on hilisem,
	   kui järjendi viimase elemendi oma. Kui on siis asendame */
	var lastElemNr =  times.length -1;
	if (xmlDate_ms > times[lastElemNr]){
		times[lastElemNr] = xmlDate_ms;
		news[lastElemNr] = xmlinfo;
	}
	else {
		return [];
	}
	
	// Järjendi viimase ja eelviimase elemendi indeksid
	var m = (times.length) - 1;
	var k = (times.length) - 2;
	
	//Tsükkel, mis sorteerib järjendite elemendid
	for (i=0; i<(times.length)-1;i++){
	
		if ( times[m] > times[k]){
			tempNews = news[m];
			news[m]= news[k];
			news[k] = tempNews;
			tempTime = times[m];
			times[m]= times[k];
			times[k] = tempTime;	
		}
		m = m-1;
		k = k-1;		
	}

	// tagastame sorteeritud järjendid
	return  [times, news];
}

/* Funktsioon leiab vajaliku info xml-faili sektsioonist ja viib selle teksti kujule.
   Funktsiooni argument "doc_object" on xml faili "doc" tag-ide vahel oleva info kogum */
function  extractXmlInfo(doc_object){
	var titleinfo;
	var descriptinfo;
	var dateinfo;
	var authorinfo;
	var linkinfo;
	
	
	doc_childs = doc_object.childNodes;
	
	// Vaatleme "doc" tagi kõiki alamaid ja väärtustame muutujad
	for (i=0;i<doc_childs.length;i++){
		if (doc_childs[i].nodeName == "str"){
			if (doc_childs[i].getAttribute("name")== "title"){
				titleinfo = doc_childs[i].childNodes[0].nodeValue;
			}
			else if (doc_childs[i].getAttribute("name")== "description"){
				descriptinfo = doc_childs[i].childNodes[0].nodeValue;
			}
			else if (doc_childs[i].getAttribute("name")== "author"){
				authorinfo = doc_childs[i].childNodes[0].nodeValue;
			}
			else if (doc_childs[i].getAttribute("name")== "link"){
				linkinfo = doc_childs[i].childNodes[0].nodeValue;
			}
		}
		
		else if (doc_childs[i].nodeName == "date"){
			if(doc_childs[i].getAttribute("name")== "date"){
				dateinfo = doc_childs[i].childNodes[0].nodeValue;
			}
		}
	}
	// Tagastame uudise : pealkirja, kirjelduse, aja, autori, lingi uudise lehele
	return [titleinfo,descriptinfo,dateinfo,authorinfo,linkinfo];
}

if (window.XMLHttpRequest)
{// code for IE7+, Firefox, Chrome, Opera, Safari
	xmlhttp=new XMLHttpRequest();
 }
else
 {// code for IE6, IE5
	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
 }
 
xmlhttp.open("GET","news.xml",false);
xmlhttp.send();
xmlDoc=xmlhttp.responseXML;

// Leiame doc sektsioonid dokumendist
doc_tags = xmlDoc.getElementsByTagName("doc");

// Muutuja, mida kasutame uudise suunamiseks õige kategooria alla
var blockName = null;

var xmlInfo = null;
var categorys = null;
var infoArray = null;
var shortDescription = null;

// Järjend, nelja viimase uudise salvestamiseks
var newsArray = [[],[],[],[]];
// Järjend, nelja viimase uudise aegade salvestamiseks
var timeArray = [0,0,0,0];

/* Abi järjend, mille abil väärtustame "newsArray"
   ja "timeArray" ümber pärast "updateLatestNews"
   funktsioonist väljumist.
*/
var containArray;

// K6ikidest "doc" sektsioonidest otsime vajaliku info
for (elem = 0; elem < doc_tags.length; elem++){
	single_doc = doc_tags[elem];
	category_tag = single_doc.getElementsByTagName("arr")[0];
	
	categorys = category_tag.childNodes;
	
	xmlInfo = extractXmlInfo(single_doc);
	containArray = updateLatestNews(timeArray,newsArray,xmlInfo);
	if (typeof containArray[0] !== 'undefined' &&  containArray[0] !== null){
		timeArray = containArray[0];
		newsArray = containArray[1];
	}
	
	shortDescription = xmlInfo[1].substring(0,1500) + "...";
	//test = Date.parse(xmlInfo[2]);
	blockName = determineBlockName(categorys);
	
	// Kirjutame uudise sisu html-i
	if (blockName != 0){
		fill(blockName,xmlInfo[0],shortDescription,xmlInfo[2],xmlInfo[3],xmlInfo[4]);

	}
}
// Kirjutame viimaste uudiste sisu html-i
for (i=0;i < newsArray.length; i++){
	fillLatest("latestBlock", newsArray[i][0],newsArray[i][1],newsArray[i][2],newsArray[i][3]);
}
