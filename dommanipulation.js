const template = document.createElement('template');
template.innerHTML = `
  <style>
  .something-to-show {
		font-family: 'Arial', sans-serif;
		background: #f4f4f4;
		width: 500px;
		display: grid;
		grid-template-columns: 1fr 2fr;
		grid-gap: 10px;
		margin-bottom: 15px;
		border-bottom: darkorchid 5px solid;
	}

	.something-to-show img {
		width: 100%;
	}

	.something-to-show button {
		cursor: pointer;
		background: darkorchid;
		color: #fff;
		border: 0;
		border-radius: 5px;
		padding: 5px 10px;
	}
  </style>
  <!-- Määritellään templaten runko -->
  <div class="something-to-show">
    <img />
    <div>
      <h3></h3>
      <div class="info">
      <!-- Komponentin atribuuttien slot-placeholderit -->
        <p><slot name="email" /></p>
        <p><slot name="phone" /></p>
      </div>
      <button id="toggle-info">Piilota tiedot</button>
    </div>
  </div>
`;

// Lyhyesti: Shadow DOM -tekniikalla voimme luoda omia kustomoituja elementtejä, jotka sisältävät omat tyylinsä ja toiminnallisuutensa.
// Aluksi luodaan template, josta ja johon voidaan palauttaa sitä käytettäessä tyylitellysti dataa. Lisäksi pitää määritellä host, joka on se elementti, 
// johon luotu shadow DOM -puu liitetään (elementti alla ja index-tiedostossa on something-to-show). Shadow-root taas on shadow-puun ylin kohta.
// Shadow DOMia käyttämällä saavutetaan seuraavat edut:
// - Emme ole riippuvaisia mistään frameworkeistä. Riipumme vain ES-kehityksestä ja siitä miten V8 ja muut selaimien JS-moottorit kehittyvät
// - Kun virtual DOMit (React/Vue/Angular/jne) ovat kokonaisia kopioita DOMista (jota verrataan varsinaiseen DOMiin), niin Shadow DOMilla lisätään vain tarvittavat osat (puut) varsinaiseen DOMiin
// - Koska tyylit ovat aina omassa skoupissaan, selain päivittää vain tavittavat osat, mikä saattaa tuoda suorituskykyyn parannuksia (tämän todentaminen vielä puuttuu) 
// - Ihana vaniljan tuoksu!
// - Saamme tasan sen mitä haluamme ja kuinka haluamme
// - Koska perusperiaate on se, että käytetään templateja ja komponentteja sekä komponentit rakennetaan aina omina moduleinaan, pysyy koodi ymmärrettävänä, selkeänä, jäsenneltynä
// - kun vältetään komponenttien välisiä funktiokutsuja ja tehdään homma event-based-tyyliin, niin komponentteja poistettaessa emme riko koko sivustoa
// Mahdollisia huonoja puolia_
// - Voi vaatia aluksi hieman enemmän pähkäilyä kuin jos käytämme valmiita framewokejä


class SomethingToShow extends HTMLElement {
    constructor() {
        // Normi tapa kutsua yläluokan konstruktoria
        super();

        this.showInfo = true;

        // Lisätään shadow DOM -puu sitä käyttävään elementtiin. hostiin + palauttaa viittauksen "shadow rootiin"
        this.attachShadow({ mode: 'open' }); 
        // Appendataan shadowRootiin klooni templatesta
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        // Luetaan index.html:ssä komponenttin kautta syötetyt atribuutit
        this.shadowRoot.querySelector('h3').innerText = this.getAttribute('name');
        this.shadowRoot.querySelector('img').src = this.getAttribute('avatar');
  }

// Swäpätään infolaatikkoa (ei magiaa, kommentoi itse itsensä)
  toggleInfo() {
    this.showInfo = !this.showInfo;

    const info = this.shadowRoot.querySelector('.info');
    const toggleBtn = this.shadowRoot.querySelector('#toggle-info');

    if(this.showInfo) {
      info.style.display = 'block';
      toggleBtn.innerText = 'Piilota tiedot';
    } else {
      info.style.display = 'none';
      toggleBtn.innerText = 'Näytä tiedot';
    }
  }

// Kutsutaan, kun elementti insertoidaan dokument-objektiin. Aiemmin tätä ei ikään kuin ole olemassakaan
// Kutsussa lisätään EventListener templatessa määritellylle buttonille
  connectedCallback() {
    this.shadowRoot.querySelector('#toggle-info').addEventListener('click', () => this.toggleInfo());
  }

// Yllä olevan käänteinen toimenpide
  disconnectedCallback() {
    this.shadowRoot.querySelector('#toggle-info').removeEventListener();
  }
}

// Lisätään luomamme elementti itse tehtyjen elementtien listalle antaen sille kutstumanimi ja kertoen, mitä luokkaa käytetään
window.customElements.define('something-to-show', SomethingToShow);