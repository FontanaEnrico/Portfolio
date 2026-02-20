// ============================================================
// CHATBOT PORTFOLIO - Enrico Fontana
// Powered by Google Gemini API (gratuita, no carta di credito)
// Ogni visitatore inserisce la propria API key personale
// Modelli aggiornati: gemini-2.0-flash, gemini-2.5-flash
// ============================================================

(function () {

  const PORTFOLIO_CONTEXT = `Sei l'assistente virtuale del portfolio di Enrico Fontana, un Cloud Developer italiano.
Rispondi SEMPRE in italiano, in modo amichevole, conciso e professionale.
Sei incorporato nel sito portfolio di Enrico e aiuti i visitatori a conoscerlo meglio.

=== HOME ===
Enrico Fontana e un Cloud Developer appassionato di tecnologia e sviluppo software.
Il portfolio ha le sezioni: Home, Chi Sono, Esperienze, Formazione, Lavori.
Nel footer sono presenti i link a LinkedIn e Instagram per contattarlo.
E disponibile il download del suo CV.

=== CHI SONO ===
Enrico e uno sviluppatore software di 21 anni appassionato di tecnologia e innovazione.
Sta frequentando un corso di specializzazione presso ITS Adriano Olivetti per diventare tecnico superiore sviluppatore software.
Ha una formazione in grafica pubblicitaria e ha lavorato come graphic designer, creando loghi, brochure e materiali di marketing per diverse aziende.
E entusiasta di combinare le sue competenze creative con le conoscenze tecniche per sviluppare soluzioni software innovative e funzionali.
Nel tempo libero esplora nuove tecnologie, lavora su progetti personali e migliora le sue abilita di programmazione.

=== ESPERIENZE LAVORATIVE ===
1. Sistemista informatico
   - Anno: 2025
   - Azienda: Vem Sistemi
   - Descrizione: Ha lavorato come sistemista informatico in ambito security tramite firewall, routing e switch.

2. Graphic Designer
   - Anno: 2022
   - Aziende: Samorani Group e Sunset
   - Descrizione: Creazione di loghi, brochure e materiali di marketing. Creazione di manifesti per supermercati come Conad e videomaking.

=== FORMAZIONE ===
1. Diploma di specializzazione - Tecnico Superiore Sviluppatore Software
   - Anno: 2024 - In corso
   - Istituto: ITS Adriano Olivetti
   - Descrizione: Corso biennale post diploma focalizzato su sviluppo software, tecnologie moderne e metodologie agili.

2. Diploma 5 superiore - Grafico Pubblicitario
   - Anno: 2018 - 2023
   - Istituto: Istituto Professionale Ruffilli
   - Campo di studio: Grafico Pubblicitario
   - Voto finale: 100/100

=== COMPETENZE ===
   - HTML, CSS, JavaScript
   - Python, C#, TypeScript, React, Nodered
   - MongoDB, MySQL
   - Git, GitHub, Docker, Putty, Cisco, Fortinet, Cisco Packet Tracer, Postman
   - Windows, Linux: Arch, Ubuntu, Garruda, Kali
   - Adobe Illustrator, Adobe Photoshop, Adobe InDesign

=== LINGUE ===
   - Italiano: Nativo
   - Inglese: B1
   - Spagnolo: B1

=== PATENTE ===
   - Patenti: A1, B

=== LAVORI / PROGETTI ===
- B&C Solution: progetto disponibile come PDF nel portfolio (sezione Lavori).
- Altri progetti: Coming Soon, nuovi lavori in arrivo.

COMPORTAMENTO:
- Rispondi in modo conciso (max 3-4 frasi)
- Usa i dati reali qui sopra per rispondere con precisione
- Se ti chiedono qualcosa non presente, invita a visitare la sezione apposita o a contattare Enrico via LinkedIn
- Sii sempre positivo e incoraggia i visitatori ad esplorare il portfolio`;

  const STORAGE_KEY = "portfolio_gemini_apikey";

  const MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
  ];

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

    #cb-container * { box-sizing: border-box; margin: 0; padding: 0; }

    #cb-toggle {
      position: fixed; bottom: 28px; right: 28px;
      width: 62px; height: 62px; border-radius: 50%;
      background: linear-gradient(135deg, #00ffff 0%, #0099bb 100%);
      border: none; cursor: pointer; z-index: 9999;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 0 20px rgba(0,255,255,0.5), 0 4px 20px rgba(0,0,0,0.4);
      transition: transform 0.3s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s ease;
    }
    #cb-toggle:hover {
      transform: scale(1.12) rotate(8deg);
      box-shadow: 0 0 35px rgba(0,255,255,0.7), 0 6px 25px rgba(0,0,0,0.5);
    }
    #cb-toggle svg { width: 28px; height: 28px; fill: #000; }
    #cb-toggle.open svg.ic-chat { display: none; }
    #cb-toggle:not(.open) svg.ic-close { display: none; }

    #cb-window {
      position: fixed; bottom: 105px; right: 28px;
      width: 370px; max-width: calc(100vw - 40px);
      height: 530px; max-height: calc(100vh - 130px);
      background: #0a0a0a; border: 1px solid rgba(0,255,255,0.2);
      border-radius: 20px;
      box-shadow: 0 0 40px rgba(0,255,255,0.12), 0 20px 60px rgba(0,0,0,0.7);
      z-index: 9998; display: flex; flex-direction: column; overflow: hidden;
      transform: scale(0.85) translateY(20px); opacity: 0; pointer-events: none;
      transform-origin: bottom right;
      transition: transform 0.35s cubic-bezier(.34,1.56,.64,1), opacity 0.25s ease;
    }
    #cb-window.visible {
      transform: scale(1) translateY(0); opacity: 1; pointer-events: all;
    }

    #cb-header {
      background: linear-gradient(135deg, rgba(0,255,255,0.1), rgba(0,150,180,0.06));
      border-bottom: 1px solid rgba(0,255,255,0.12);
      padding: 14px 16px; display: flex; align-items: center; gap: 10px; flex-shrink: 0;
    }
    #cb-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: linear-gradient(135deg, #00ffff, #0077aa);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Space Mono', monospace; font-weight: 700; font-size: 12px;
      color: #000; flex-shrink: 0; box-shadow: 0 0 12px rgba(0,255,255,0.4);
    }
    #cb-header-info { flex: 1; }
    #cb-header-name {
      font-family: 'Space Mono', monospace; font-size: 12px;
      font-weight: 700; color: #00ffff; letter-spacing: 0.05em;
    }
    #cb-header-status {
      font-family: 'DM Sans', sans-serif; font-size: 11px;
      color: rgba(255,255,255,0.4); display: flex; align-items: center; gap: 5px; margin-top: 2px;
    }
    #cb-header-status::before {
      content: ''; display: inline-block; width: 6px; height: 6px;
      border-radius: 50%; background: #00ff88; box-shadow: 0 0 6px #00ff88;
      animation: cb-pulse 2s infinite;
    }
    @keyframes cb-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

    #cb-clear {
      background: none; border: 1px solid rgba(0,255,255,0.18); border-radius: 8px;
      color: rgba(0,255,255,0.45); cursor: pointer; padding: 4px 8px;
      font-size: 10px; font-family: 'Space Mono', monospace; transition: all 0.2s;
    }
    #cb-clear:hover { color: #00ffff; border-color: rgba(0,255,255,0.5); background: rgba(0,255,255,0.05); }

    #cb-messages {
      flex: 1; overflow-y: auto; padding: 14px;
      display: flex; flex-direction: column; gap: 11px;
      scrollbar-width: thin; scrollbar-color: rgba(0,255,255,0.2) transparent;
    }
    #cb-messages::-webkit-scrollbar { width: 4px; }
    #cb-messages::-webkit-scrollbar-thumb { background: rgba(0,255,255,0.2); border-radius: 2px; }

    .cb-msg { display: flex; gap: 8px; animation: cb-in 0.28s ease forwards; }
    @keyframes cb-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    .cb-msg.user { flex-direction: row-reverse; }

    .cb-bubble {
      max-width: 82%; padding: 9px 13px; border-radius: 15px;
      font-family: 'DM Sans', sans-serif; font-size: 13.5px; line-height: 1.55;
    }
    .cb-msg.bot .cb-bubble {
      background: rgba(255,255,255,0.05); border: 1px solid rgba(0,255,255,0.1);
      color: rgba(255,255,255,0.87); border-bottom-left-radius: 4px;
    }
    .cb-msg.user .cb-bubble {
      background: linear-gradient(135deg, rgba(0,255,255,0.16), rgba(0,150,180,0.1));
      border: 1px solid rgba(0,255,255,0.22); color: #fff; border-bottom-right-radius: 4px;
    }
    .cb-bubble.error {
      border-color: rgba(255,100,100,0.3) !important;
      background: rgba(255,50,50,0.05) !important;
    }

    .cb-icon {
      width: 26px; height: 26px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; margin-top: 3px; font-size: 10px;
    }
    .cb-msg.bot .cb-icon {
      background: linear-gradient(135deg, #00ffff, #0077aa); color: #000;
      font-family: 'Space Mono', monospace; font-weight: 700;
      box-shadow: 0 0 8px rgba(0,255,255,0.3);
    }
    .cb-msg.user .cb-icon { background: rgba(255,255,255,0.08); }
    .cb-msg.user .cb-icon svg { width: 14px; height: 14px; fill: rgba(255,255,255,0.55); }

    .cb-typing { display: flex; gap: 4px; align-items: center; padding: 10px 13px; }
    .cb-dot { width: 6px; height: 6px; border-radius: 50%; background: #00ffff; animation: cb-dots 1.2s infinite; }
    .cb-dot:nth-child(2){animation-delay:.2s} .cb-dot:nth-child(3){animation-delay:.4s}
    @keyframes cb-dots { 0%,60%,100%{opacity:.3;transform:translateY(0)} 30%{opacity:1;transform:translateY(-4px)} }

    #cb-api-panel {
      border-top: 1px solid rgba(0,255,255,0.1);
      padding: 14px 16px; flex-shrink: 0;
      background: rgba(0,255,255,0.03);
    }
    #cb-api-panel p {
      font-family: 'DM Sans', sans-serif; font-size: 12px;
      color: rgba(255,255,255,0.5); margin-bottom: 10px; line-height: 1.6;
    }
    #cb-api-panel p a { color: #00ffff; text-decoration: none; }
    #cb-api-panel p a:hover { text-decoration: underline; }
    #cb-api-panel p strong { color: rgba(255,255,255,0.8); }
    #cb-api-steps {
      font-family: 'Space Mono', monospace; font-size: 10px;
      color: rgba(255,255,255,0.35); margin-bottom: 10px; line-height: 1.9;
    }
    #cb-api-steps span { color: #00ffff; }
    #cb-api-row { display: flex; gap: 6px; }
    #cb-api-input {
      flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(0,255,255,0.2);
      border-radius: 10px; padding: 9px 12px; color: #fff;
      font-family: 'Space Mono', monospace; font-size: 11px;
      outline: none; transition: border-color 0.2s;
    }
    #cb-api-input:focus { border-color: rgba(0,255,255,0.5); }
    #cb-api-input::placeholder { color: rgba(255,255,255,0.2); }
    #cb-api-btn {
      background: linear-gradient(135deg, #00ffff, #0099bb); border: none;
      border-radius: 10px; color: #000; cursor: pointer; padding: 9px 14px;
      font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700;
      transition: transform 0.2s, box-shadow 0.2s; white-space: nowrap;
    }
    #cb-api-btn:hover { transform: scale(1.05); box-shadow: 0 0 12px rgba(0,255,255,0.4); }

    #cb-key-bar {
      border-top: 1px solid rgba(0,255,255,0.08);
      padding: 6px 16px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: space-between;
      background: rgba(0,0,0,0.2);
    }
    #cb-key-info {
      font-family: 'Space Mono', monospace; font-size: 10px;
      color: rgba(0,255,255,0.5); display: flex; align-items: center; gap: 6px;
    }
    #cb-key-info::before {
      content: ''; display: inline-block; width: 5px; height: 5px;
      border-radius: 50%; background: #00ff88; box-shadow: 0 0 5px #00ff88;
    }
    #cb-key-remove {
      background: none; border: none; cursor: pointer;
      font-family: 'Space Mono', monospace; font-size: 10px;
      color: rgba(255,80,80,0.5); transition: color 0.2s; padding: 0;
    }
    #cb-key-remove:hover { color: rgba(255,80,80,0.9); }

    #cb-input-area {
      border-top: 1px solid rgba(0,255,255,0.1); padding: 10px 12px;
      display: flex; gap: 8px; flex-shrink: 0; background: rgba(0,0,0,0.3);
    }
    #cb-input {
      flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(0,255,255,0.18);
      border-radius: 12px; padding: 9px 13px; color: #fff;
      font-family: 'DM Sans', sans-serif; font-size: 13.5px;
      outline: none; resize: none; height: 42px; min-height: 42px; max-height: 110px;
      overflow-y: auto; transition: border-color 0.2s; line-height: 1.4;
    }
    #cb-input:focus { border-color: rgba(0,255,255,0.42); }
    #cb-input::placeholder { color: rgba(255,255,255,0.25); }
    #cb-send {
      width: 42px; height: 42px; border-radius: 12px;
      background: linear-gradient(135deg, #00ffff, #0099bb);
      border: none; cursor: pointer; display: flex; align-items: center;
      justify-content: center; flex-shrink: 0; transition: transform 0.2s, box-shadow 0.2s;
    }
    #cb-send:hover:not(:disabled) { transform: scale(1.08); box-shadow: 0 0 15px rgba(0,255,255,0.5); }
    #cb-send:disabled { opacity: 0.35; cursor: not-allowed; }
    #cb-send svg { width: 18px; height: 18px; fill: #000; }

    #cb-notif {
      position: fixed; bottom: 100px; right: 28px;
      background: #0d0d0d; border: 1px solid rgba(0,255,255,0.28);
      border-radius: 12px; padding: 10px 14px;
      font-family: 'DM Sans', sans-serif; font-size: 13px;
      color: rgba(255,255,255,0.82); z-index: 9997; display: none; max-width: 260px;
      box-shadow: 0 0 20px rgba(0,255,255,0.12);
    }

    #cb-powered {
      text-align: center; padding: 4px 0 6px;
      font-family: 'Space Mono', monospace; font-size: 9px;
      color: rgba(255,255,255,0.15); letter-spacing: 0.08em; flex-shrink: 0;
    }
    #cb-powered span { color: rgba(0,255,255,0.25); }

    @media (max-width: 768px) {
      #cb-toggle {
        position: fixed !important;
        bottom: 72px !important;
        right: 18px !important;
        width: 50px !important;
        height: 50px !important;
        transform: none;
        -webkit-transform: none;
        will-change: transform;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
      }
      #cb-toggle svg { width: 22px; height: 22px; }
      #cb-window {
        bottom: 132px;
        right: 12px;
        width: calc(100vw - 24px);
        max-width: 100%;
      }
      #cb-notif {
        bottom: 132px;
        right: 12px;
        max-width: calc(100vw - 24px);
      }
    }
  `;

  function buildHTML() {
    return `
      <button id="cb-toggle" title="Chatta con me!">
        <svg class="ic-chat" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
        <svg class="ic-close" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </button>

      <div id="cb-window">
        <div id="cb-header">
          <div id="cb-avatar">EF</div>
          <div id="cb-header-info">
            <div id="cb-header-name">ASSISTENTE PORTFOLIO</div>
            <div id="cb-header-status">Online · Enrico Fontana</div>
          </div>
          <button id="cb-clear">CLEAR</button>
        </div>

        <div id="cb-messages"></div>

        <div id="cb-api-panel">
          <p>
            Per chattare, inserisci la tua <strong>Gemini API Key</strong> gratuita.<br>
            Viene salvata solo nel tuo browser, non condivisa con nessuno.
          </p>
          <div id="cb-api-steps">
            <span>1.</span> Vai su <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color:#00ffff">aistudio.google.com/app/apikey</a><br>
            <span>2.</span> Accedi con Google → <strong style="color:rgba(255,255,255,0.6)">"Create API Key"</strong><br>
            <span>3.</span> Copia e incolla qui sotto
          </div>
          <div id="cb-api-row">
            <input id="cb-api-input" type="password" placeholder="AIzaSy...">
            <button id="cb-api-btn">SALVA</button>
          </div>
        </div>

        <div id="cb-key-bar" style="display:none">
          <span id="cb-key-info">API KEY ATTIVA</span>
          <button id="cb-key-remove">✕ rimuovi</button>
        </div>

        <div id="cb-input-area">
          <textarea id="cb-input" placeholder="Chiedimi qualcosa su Enrico..." rows="1"></textarea>
          <button id="cb-send" title="Invia">
            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
        <div id="cb-powered">POWERED BY <span>GEMINI 2.5 FLASH</span> · FREE TIER</div>
      </div>

      <div id="cb-notif"></div>
    `;
  }

  function init() {
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    const container = document.createElement('div');
    container.id = 'cb-container';
    container.innerHTML = buildHTML();
    document.documentElement.appendChild(container);

    const toggle    = document.getElementById('cb-toggle');
    const win       = document.getElementById('cb-window');
    const msgs      = document.getElementById('cb-messages');
    const input     = document.getElementById('cb-input');
    const sendBtn   = document.getElementById('cb-send');
    const clearBtn  = document.getElementById('cb-clear');
    const apiPanel  = document.getElementById('cb-api-panel');
    const apiInput  = document.getElementById('cb-api-input');
    const apiBtn    = document.getElementById('cb-api-btn');
    const keyBar    = document.getElementById('cb-key-bar');
    const keyRemove = document.getElementById('cb-key-remove');
    const notif     = document.getElementById('cb-notif');

    let isOpen      = false;
    let isLoading   = false;
    let apiKey      = localStorage.getItem(STORAGE_KEY) || '';
    let chatHistory = [];

    function showNotif(text, ms = 4500) {
      notif.textContent = text;
      notif.style.display = 'block';
      clearTimeout(notif._t);
      notif._t = setTimeout(() => { notif.style.display = 'none'; }, ms);
    }

    function updateKeyUI() {
      if (apiKey) {
        apiPanel.style.display = 'none';
        keyBar.style.display = 'flex';
        input.disabled = false;
        sendBtn.disabled = false;
      } else {
        apiPanel.style.display = 'block';
        keyBar.style.display = 'none';
        input.disabled = true;
        sendBtn.disabled = true;
      }
    }

    function addMsg(role, text, isError = false) {
      const div = document.createElement('div');
      div.className = `cb-msg ${role}`;
      const icon = document.createElement('div');
      icon.className = 'cb-icon';
      if (role === 'bot') {
        icon.textContent = 'EF';
      } else {
        icon.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>`;
      }
      const bubble = document.createElement('div');
      bubble.className = 'cb-bubble' + (isError ? ' error' : '');
      bubble.textContent = text;
      div.appendChild(icon);
      div.appendChild(bubble);
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function addTyping() {
      const div = document.createElement('div');
      div.className = 'cb-msg bot'; div.id = 'cb-typing';
      const icon = document.createElement('div');
      icon.className = 'cb-icon';
      icon.style.cssText = 'background:linear-gradient(135deg,#00ffff,#0077aa);color:#000;font-family:Space Mono,monospace;font-weight:700;';
      icon.textContent = 'EF';
      const bubble = document.createElement('div');
      bubble.className = 'cb-bubble';
      bubble.innerHTML = '<div class="cb-typing"><div class="cb-dot"></div><div class="cb-dot"></div><div class="cb-dot"></div></div>';
      div.appendChild(icon); div.appendChild(bubble);
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function removeTyping() {
      const t = document.getElementById('cb-typing');
      if (t) t.remove();
    }

    async function callGemini(modelIndex) {
      if (modelIndex >= MODELS.length) return null;
      const model = MODELS[modelIndex];
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: PORTFOLIO_CONTEXT }] },
          contents: chatHistory,
          generationConfig: { maxOutputTokens: 400, temperature: 0.7 }
        })
      });
      const data = await res.json();
      if (res.status === 404) {
        console.warn(`[Chatbot] ${model} non disponibile, provo ${MODELS[modelIndex + 1] || 'nessun altro'}...`);
        return callGemini(modelIndex + 1);
      }
      return { res, data, model };
    }

    async function sendMessage() {
      const text = input.value.trim();
      if (!text || isLoading || !apiKey) return;

      isLoading = true;
      sendBtn.disabled = true;
      input.value = '';
      input.style.height = '42px';

      addMsg('user', text);
      chatHistory.push({ role: 'user', parts: [{ text }] });
      addTyping();

      try {
        const result = await callGemini(0);
        removeTyping();

        if (!result) {
          addMsg('bot', '⚠️ Nessun modello Gemini disponibile per questa chiave. Prova a ricrearla su aistudio.google.com', true);
        } else {
          const { res, data, model } = result;
          if (!res.ok) {
            const errCode   = data.error?.code    || res.status;
            const errStatus = data.error?.status  || '';
            const errMsg    = data.error?.message || '';
            console.error(`[Chatbot] Errore API ${errCode} (${model}):`, errMsg);

            if (errCode === 401 || errStatus === 'UNAUTHENTICATED') {
              addMsg('bot', '⚠️ API Key non valida. Rimuovila e inseriscine una nuova.', true);
              apiKey = ''; localStorage.removeItem(STORAGE_KEY); updateKeyUI();
            } else if (errCode === 403 || errStatus === 'PERMISSION_DENIED') {
              addMsg('bot', '⚠️ Chiave senza permessi. Assicurati di crearla su AI Studio (aistudio.google.com), non su Google Cloud.', true);
            } else if (errCode === 429 || errStatus === 'RESOURCE_EXHAUSTED') {
              addMsg('bot', '⏳ Limite gratuito raggiunto. Aspetta 1 minuto e riprova!', true);
            } else {
              addMsg('bot', `⚠️ Errore ${errCode}. Riprova tra poco.`, true);
            }
          } else {
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Scusa, non ho capito. Puoi riformulare?';
            addMsg('bot', reply);
            chatHistory.push({ role: 'model', parts: [{ text: reply }] });
            if (chatHistory.length > 40) chatHistory = chatHistory.slice(-40);
          }
        }
      } catch (e) {
        removeTyping();
        console.error('[Chatbot] Errore di rete:', e);
        addMsg('bot', '⚠️ Impossibile connettersi. Controlla la tua connessione internet.', true);
      }

      isLoading = false;
      sendBtn.disabled = false;
      input.focus();
    }

    function showWelcome() {
      if (msgs.children.length === 0) {
        addMsg('bot', '👋 Ciao! Sono l\'assistente virtuale di Enrico Fontana. Posso aiutarti a scoprire le sue competenze, esperienze e progetti. Come posso aiutarti?');
      }
    }

    toggle.addEventListener('click', () => {
      isOpen = !isOpen;
      toggle.classList.toggle('open', isOpen);
      win.classList.toggle('visible', isOpen);
      if (isOpen) {
        updateKeyUI(); showWelcome();
        setTimeout(() => { if (!input.disabled) input.focus(); }, 360);
        notif.style.display = 'none';
      }
    });

    clearBtn.addEventListener('click', () => {
      chatHistory = []; msgs.innerHTML = ''; showWelcome();
    });

    apiBtn.addEventListener('click', () => {
      const val = apiInput.value.trim();
      if (val.length < 15) { showNotif('⚠️ Chiave non valida. Assicurati di averla copiata per intero.'); return; }
      apiKey = val;
      localStorage.setItem(STORAGE_KEY, apiKey);
      apiInput.value = '';
      updateKeyUI();
      showNotif('✅ API Key salvata! Ora puoi chattare.');
      setTimeout(() => input.focus(), 100);
    });
    apiInput.addEventListener('keydown', e => { if (e.key === 'Enter') apiBtn.click(); });

    keyRemove.addEventListener('click', () => {
      apiKey = ''; localStorage.removeItem(STORAGE_KEY);
      chatHistory = []; msgs.innerHTML = '';
      updateKeyUI(); showWelcome();
    });

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    input.addEventListener('input', () => {
      input.style.height = '42px';
      input.style.height = Math.min(input.scrollHeight, 110) + 'px';
    });

    setTimeout(() => { if (!isOpen) showNotif('💬 Hai domande su Enrico? Chiedimi!'); }, 6000);

  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();