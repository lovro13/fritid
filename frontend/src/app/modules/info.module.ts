import { Injectable } from '@angular/core';

export interface InfoPage {
  id: number,
  label: string,
  link: string,
  content: string
}

@Injectable({ providedIn: 'root' })
export class InfoService {
  private infoPages: InfoPage[] = [
    {
      id: 1, label: 'O nas', link: '/info/1', content:
        `Podjetje FRITID d.o.o.  je slovensko podjetje, v katerem vam lahko po konkurenčnih cenah ponudimo stekleno embalažo kot tudi plastično embalažo različnih volumnov.

Skladišče najdete na naslovu Ljubljanska cesta 45, ind. cona STOL, 1241 Kamnik. Obratovalni čas od ponedeljka do petka med 8.00 in 15 uro.

_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

FRITID, trgovina in storitve, d.o.o

Spodnje Stranje 33

1242 Stahovica

Slovenija



GSM: 051 338 710
E pošta: info@fritid.si

Matična št.:  9094946000
Davčna št.: SI74433261
TRR pri NLB d.d. enota Kamnik: SI56 0231 0026 4176 406 

`},
    {
      id: 2, label: 'Postopek nakupa', link: '/info/2', content: `
Postopek nakupa v spletni trgovini Fritid je nadvse enostaven:

1. korak

Izdelek, ki ga želite kupiti, dodatje v košarico s klikom na ustrezno ikono. Izdelki so razvrščeni po kategorijah, poiščete jih lahko tudi s pomočjo iskalca.

2. korak

V košarico lahko dodate poljubno število izdelkov. Ko z dodajanjem zaključite, lahko nadaljujete z nakupovanjem ali zaključite nakup. V prvem primeru, se bodo izdelki v košarici shranili za kasnejši nakup. Izdelke v košarici lahko tudi poljubno brišete (z gumbom X) oz. spreminjate količino (vnos željene količine v okence z imenom količina in potrditev le-te s klikom na link "Ste spremenili količine? Osveži podatke!"). Ko ste dokončno oblikovali svoje naročilo, se s s klikom na gumb "Zaključi nakup" pomaknete na korak številka 3.

3. korak

Če ste registrirani uporabnik, vpišite svoje uporabniško ime in geslo v za to namenjeni polji. Neregistrirani uporabniki izpolnjujejo spodnji obrazec, kjer so polja, označena z zeleno barvo, obvezna.

4. korak

Preglejte, če je naslov naročnika pravilen. Če pošiljate izdelek nekomu za darilo, lahko naslov prejemnika blaga spremenite. V tem primeru bo račun poslan naročniku, blago pa naslovniku. Vedite le, da če pošiljate paket na drugačen naslov, kot je naročnikov, plačilo blaga po povzetju ni mogoče.

5. korak

Izberite način dostave. Možna je dostava preko paketnega distributerja GLS ali osebni prevzem. Preden kliknete na gumb za zaključek nakupovanja, še enkrat preverite, če je seznam naročenih izdelkov pravilen. Po uspešni avtorizaciji se vam bo prikazala stran s potrditvijo, da je bil nakup sprejet.

Cene veljajo ob izpolnitvi obrazca.
` },
    {
      id: 3, label: 'Varnost nakupa', link: '/info/3', content: `
Vzpostavili smo najboljše varnostne ukrepe, zato so vaši zasebni in finančni podatki (plačilne kartice in načini plačevanja) zaščiteni, ko jih pošiljate po spletu. Našteli vam bodo razloge, zakaj je nakupovanje v tej elektronski trgovini varno:

O svojem naročilu boste seznanjeni po elektronski pošti. Podjetje FRITID d.o.o. od svojih strank nikoli ne zahteva celotnih podatkov o številkah kreditnih kartic, uporabniških imenih in osebnih geslih ali drugih podatkov, s katerimi bi lahko nepooblaščena oseba na kakršenkoli način prišla na nezakonit način do vaših osebnih podatkov. Vsako pošto ali drugo sporočilo, v kateri bi oseba, ki se predstavlja za zaposlenega ali kakorkoli povezanega s podjetjem FRITID d.o.o., od vas zahtevala karkoli, s čimer bi lahko prišla do zgoraj navedenih podatkov, štejte za brezpredmetno, vsak tak poskus pa takoj javite na naslov info@fritid.si  .

` },
    {
      id: 4, label: 'Reklamacije in vračilo blaga', link: '/info/4', content: `
Vračila blaga

V primeru, da je potrošnik blago že prejel in od pogodbe odstopi, mora blago nepoškodovano in v enaki količini poslati podjetju v tridesetih dneh po sporočilu o odstopu od pogodbe. Vrnitev prejetega blaga v roku za odstop od pogodbe se šteje za sporočilo o odstopu od pogodbe. Vračilo lahko kupec pošlje po pošti ali dostavi osebno na sedež podjetja FRITID d.o.o. .

Odstop od pogodbe ni mogoč, če je potrošnik odprl varnostni pečat (ZVP 43. č člen). Za odprtje varnostnega pečata se šteje pretrganje ovojne folije na pokrovčku izdelka.

Odstop od pogodbe

Kupec lahko, v skladu s 43. členom zakona o varstvu potrošnikov, v 14 dneh od prejetja pošiljke izdelek vrne brez obrazložitve svojega dejanja. V takem primeru se zavezujemo, da bomo v najkrajšem možnem času kupcu vrnili denar za prejeto plačilo. V primeru vračila bomo denar najkasneje v tridesetih dneh nakazali na kupčev tekoči račun. Blago mora kupec vrniti na lastne stroške.` },
    {
      id: 5, label: 'Splošni pogoji', link: '/info/5', content: `
Pazljivo preberite naslednje splošne pogoje poslovanja elektronske trgovine (splošne pogoje), saj vas ti zavezujejo s trenutkom, ko vstopite na našo elektronsko trgovino. Splošni pogoji so veljavni na vseh straneh elektronske trgovine brez izjeme. V primeru, da se s ponujenimi splošnimi pogoji ne strinjate, vas prosimo, da ogleda strani in nakupa prek naše elektronske trgovine ne opravite. Šteje se, da ste z vsakim ogledom ali s transakcijo, opravljeno prek naše elektronske trgovine, seznanjeni s celotno vsebino splošnih pogojev in ste v ponujene splošne pogoje privolili brez omejitev. Tudi v prihodnje ste, do preklica ali spremembe veljavnih splošnih pogojev, ob vsakem ogledu ali pri vsaki transakciji, opravljeni na naši strani, zavezani z navedenim splošnim pogoji. Splošne pogoje bomo redno ažurirali in v vsakem trenutku v svoji najnovejši in veljavni verziji v celotnem besedilu dostopni vsakomur brez težav.

Podjetje FRITID d.o.o. si pridržuje pravico do kakršnihkoli sprememb, delnih ali v celoti, kateregakoli dela splošnih pogojev brez posebne najave. Spremembe veljajo od trenutka objave.

Podjetje FRITID d.o.o. se zavezuje, da bo poslovanje elektronske trgovine v skladu z vso veljavno zakonodajo.

Podjetje FRITID d.o.o. se ne zavezuje za pravilnost in popolnost podatkov na straneh elektronske trgovine, niti se ne zavezujeta za pravilnost in popolnost tekstovnega, slikovnega ali zvočnega materiala.

Vsa komunikacija, ki se vrši med kupcem in podjetjem FRITID d.o.o. v elektronski obliki se šteje, kot da je bila izvedena v pisni obliki in ima veljavo pogodbe.

Elektronska trgovina je odprta 24 ur na dan, vsak dan. Zaradi različnih tehničnih ali drugačnih razlogov poslovanje preko naše elektronske trgovine ali celo dostop do trgovine včasih ni mogoč. Zato si podjetje FRITID d.o.o. pridržuje pravico, da za določen ali nedoločen čas omeji ali popolnoma ustavi prodajo nekaterih ali celo vseh izdelkov ali da za določen ali nedoločen čas omeji ali popolnoma ustavi dostop do strani elektronske trgovine ali drugače omeji ali ustavi poslovanje elektronske trgovine.

Ponudba in pogodba v elektronski trgovini sta v celoti objavljeni v slovenskem jeziku. Ponudba velja do objave novega cenika. Elektronska trgovina posluje samo na ozemlju Republike Slovenije. Prodaja in dostava blaga je možna samo na ozemlju Republike Slovenije. Pogodbo je moč skleniti le v slovenskem jeziku.

En izvod pogodbe v pisni obliki prejme kupec, drug izvod je shranjen na sedežu podjetja FRITID d.o.o.. Pogodba je shranjena v elektronski obliki pri podjetju Neoserv d.o.o.

Uporabnik spletne strani v zvezi z uporabo te strani nima nikakršnih stroškov, povezanih z uporabo komunikacijskega sredstva. Podjetje FRITID d.o.o. ne zaračunava nobenih dodatnih stroškov, povezanih z uporabo komunikacijskega sredstva.

Nakup v elektronski trgovini ali sploh kakršnokoli posredovanje osebnih podatkov na straneh elektronske trgovine je dovoljen samo pravno - poslovno sposobnim osebam starejšim od 15. let, ostale osebe morajo za vsako posredovano informacijo pridobiti zakonsko veljavno soglasje staršev ali skrbnika.

Podjetje FRITID d.o.o. ne prevzema nikakršne odgovornosti za kakršnokoli okvaro vaše strojne ali programske opreme zaradi obiska in operiranja s stranmi elektronske trgovine ali za kakršnokoli škodo, povzročeno z izdelki, ali ki je v kakršnikoli zvezi z izdelki, kupljenimi v elektronski trgovini.

Morebitni spori med strankami, ki izvirajo ali so v kakršnikoli povezavi z elektronsko trgovino se rešujejo sporazumno, v nasprotnem primeru se stranke dogovorijo, da bo spor reševalo pristojno sodišče v Kamniku ob uporabi slovenskega prava.` },
    {
      id: 6, label: 'Cene in plačilni pogoji', link: '/info/6', content: `Izdelke je potrebno plačati v enkratnem znesku, razen, kjer je drugače to izrecno navedeno.

Plačati je mogoče:

Po povzetju; 
Kupec poravna stroške kupnine ob dostavi.

Osebni prevzem 
Kupec poravna stroške kupnine ob prevzemu pošiljke.

Preko spletne banke
Kupec poravna stroške preko spletne banke. Ko je transakcija vidna na naši strani, se pošiljka pošlje.` },
    {
      id: 7, label: 'Pogoji dostave in davki', link: '/info/7', content: `
Kako vam bo dostavljeno naročeno blago?

Naročeno blago lahko prejmete preko paketnega distributerja GLS oz. preko osebnega prevzema. Kupec krije poštnino sam, če je znesek nakupa nižji od 150 €, v nasprotnem primeru stroške poštnine krije podjetje FRITID d.o.o. . Stroški pakiranja in poštnine po trenutno veljavnem ceniku znašajo 6 €. Dostava naročenega blaga v spletni trgovini je mogoča le na ozemlju Republike Slovenije.

Kdaj bom prejel(a) naročeno blago?

Naročeno blago boste najverjetneje prejeli že v 48-ih urah po oddaji naročila, sicer vas bomo o morebitni zamudi obvestili po elektronski pošti. Naročila, ki jih dobimo v soboto, nedeljo ali praznik, so odpremljena prvi naslednji delovni dan (navadno ponedeljek).

Ali lahko pošljem izdelek tudi na drug naslov ali kot darilo?

Da. Izdelke lahko pošljete na katerikoli naslov znotraj ozemlja Republike Slovenije.

V kolikor želite, da je prejemnik izbranih izdelkov ali storitev druga oseba kot naročnik oziroma plačnik naročila, potrdite tipko "Pošlji na drug naslov" in v obrazec vnesite zahtevane podatke za naslov prejemnika.

V primeru, da ste kupili izdelek kot darilo, tej pošiljki ne bomo priložili računa in prejemniku ne bo potrebno nič plačati, račun pa bomo poslali na naslov naročnika.

Izdelke ali storitve je mogoče poslati na drug naslov ali kot darilo izključno ob predpogoju, da je način plačila v elektronski trgovini plačilo s Klikom.` },
    {
      id: 8, label: 'Varnost podatkov', link: '/info/8', content: `
Podjetje FRITID d.o.o. uporabnikom zagotavljata varovanje vseh njihovih osebnih podatkov. Vsi posredovani osebni podatki uporabnikov so namenjeni izključno uporabi v spletni trgovini Fritid ter administraciji storitve, te podatke pa bomo uporabljali ali razkrili le za namene, zaradi katerih jih je z vašim privoljenjem zbirala oziroma na zahtevo uradnih organov Republike Slovenije.

Piškotki

Naša spletna stran uporablja piškotke. To so majhne datoteke, ki se naložijo na vaš računalnik. 

Piškotek 1: Z njim opravljamo statistično analizo uporabnikov. Rezultati nam omogočajo izboljševanje delovanja programa spletne trgovine.

Piškotek 2: Z njim povezujemo spletno trgovino s socialnimi omrežji.

Piškotek 3: Z njim omogočimo objavo oglasov partnerskega oglaševalskega sistema. 

Podatkov, ki jih zbiramo na tak način, ne posredujemo tretjim osebam.

Piškotke lahko zavrnete, vendar bo stran zaradi tega rahlo okrnjena.` },
    {
      id: 9, label: 'Avtorska zaščita', link: '/info/9', content: `

Vse vsebine, ki so objavljene na stranehwww.fritid.si, so last podjeta FRITID d.o.o.. in/ali podjetij, katerih izdelke distributira podjetje FRITID d.o.o. . Vsa avtorska dela so zaščitena že z nastankom in jih ni potrebno posebej označevati. Prepovedana je reprodukcija, distribucija, spreminjanje, javno prikazovanje in predvajanje ter ostale oblike izkoriščanja avtorskega dela.` }
  ];

  getInfoPages(): InfoPage[] {
    return this.infoPages
  }

  getInfoPageById(id: String): InfoPage {
      let num = Number(id);
      for (let i = 0; i < this.infoPages.length; i++) {
        if (num == this.infoPages[i].id) {
          return this.infoPages[i];
        }
      }
      throw new Error("wrong id");
    }
}
