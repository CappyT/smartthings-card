// SPDX-License-Identifier: LGPL-3.0-or-later
/*
 * SmartThings laundry card: Samsung washer and dryer (DA_WM_TP2_20_COMMON)
 * exposed by the SmartThings integration. Tile on the dashboard, more-info
 * style dialog with the essential controls.
 *
 *   type: custom:smartthings-laundry-card
 *   device_id: <device id>        # or: entity: <any entity of the appliance>
 *   name: Lavatrice               # optional
 */

const VERSION = "1.1.1";

// Entities are found by translation_key, entity_ids differ per device.
const ROLES = {
  "sensor.washer_machine_state": "machineState",
  "sensor.dryer_machine_state": "machineState",
  "sensor.washer_job_state": "jobState",
  "sensor.dryer_job_state": "jobState",
  "sensor.completion_time": "completion",
  "sensor.detergent_level": "detergent",
  "sensor.softener_level": "softener",
  "select.operating_state": "operating",
  "select.washer_cycle": "cycle",
  "select.dryer_cycle": "cycle",
  "select.water_temperature": "temperature",
  "select.spin_level": "spin",
  "select.dry_level": "dryLevel",
  "select.drying_time": "dryingTime",
  "select.detergent_amount": "detergentAmount",
  "select.softener_amount": "softenerAmount",
  "number.washer_rinse_cycles": "rinse",
  "number.delay_end": "delayEnd",
  "switch.bubble_soak": "bubbleSoak",
  "switch.wrinkle_prevent": "wrinklePrevent",
  "switch.auto_cycle_link": "autoCycleLink",
  "binary_sensor.remote_control": "remote",
  "binary_sensor.child_lock": "childLock",
};

const PHASES = {
  washer: [
    { key: "wash", icon: "mdi:water", states: ["weight_sensing", "pre_wash", "wash", "ai_wash", "air_wash", "freeze_protection"] },
    { key: "rinse", icon: "mdi:water-sync", states: ["rinse", "ai_rinse"] },
    { key: "spin", icon: "mdi:rotate-right", states: ["spin", "ai_spin", "drying", "cooling", "wrinkle_prevent"] },
  ],
  dryer: [
    { key: "dry", icon: "mdi:heat-wave", states: ["weight_sensing", "drying", "ai_drying", "dehumidifying", "continuous_dehumidifying", "refreshing", "sanitizing", "internal_care"] },
    { key: "cool", icon: "mdi:snowflake", states: ["cooling"] },
    { key: "wrinkle", icon: "mdi:tshirt-crew-outline", states: ["wrinkle_prevent"] },
  ],
};

const I18N = {
  it: {
    washer: "Lavatrice", dryer: "Asciugatrice",
    wash: "Lavaggio", rinse: "Risciacquo", spin: "Centrifuga",
    dry: "Asciugatura", cool: "Raffreddamento", wrinkle: "Antipiega",
    running: "In funzione", paused: "In pausa", ready: "Pronta", finished: "Completato",
    delayed: "Partenza programmata", unavailable: "Non disponibile",
    start: "Avvia", resume: "Riprendi", pause: "Pausa", stop: "Stop",
    ends_at: "Termina alle", left: "rimanenti",
    remote_off: "Controllo remoto disattivato. Attivalo sull'apparecchio per comandarlo.",
    child_lock: "Blocco bambini attivo",
    program: "Programma", options: "Opzioni", supplies: "Detersivi",
    locked_running: "Non modificabile durante il ciclo",
    temperature: "Temperatura", spinLevel: "Centrifuga", rinseCount: "Risciacqui",
    dryLevel: "Grado asciugatura", dryingTime: "Durata",
    delayEnd: "Fine programmata", off: "Off", in: "tra",
    bubbleSoak: "Bubble Soak", wrinklePrevent: "Antipiega", autoCycleLink: "Auto Cycle Link",
    detergent: "Detersivo", softener: "Ammorbidente",
    detergentAmount: "Dose detersivo", softenerAmount: "Dose ammorbidente",
    device: "Impostazioni dispositivo", close: "Chiudi",
  },
  en: {
    washer: "Washer", dryer: "Dryer",
    wash: "Wash", rinse: "Rinse", spin: "Spin",
    dry: "Drying", cool: "Cooling", wrinkle: "Wrinkle prevent",
    running: "Running", paused: "Paused", ready: "Ready", finished: "Finished",
    delayed: "Delayed start", unavailable: "Unavailable",
    start: "Start", resume: "Resume", pause: "Pause", stop: "Stop",
    ends_at: "Ends at", left: "left",
    remote_off: "Remote control is off. Enable it on the appliance to control it.",
    child_lock: "Child lock on",
    program: "Program", options: "Options", supplies: "Supplies",
    locked_running: "Locked while a cycle runs",
    temperature: "Temperature", spinLevel: "Spin", rinseCount: "Rinses",
    dryLevel: "Dry level", dryingTime: "Drying time",
    delayEnd: "Delay end", off: "Off", in: "in",
    bubbleSoak: "Bubble Soak", wrinklePrevent: "Wrinkle prevent", autoCycleLink: "Auto Cycle Link",
    detergent: "Detergent", softener: "Softener",
    detergentAmount: "Detergent amount", softenerAmount: "Softener amount",
    device: "Device settings", close: "Close",
  },
};

const OPTION_TILES = {
  washer: [
    { role: "temperature", icon: "mdi:thermometer-water", label: "temperature" },
    { role: "spin", icon: "mdi:rotate-right", label: "spinLevel" },
    { role: "rinse", icon: "mdi:water-sync", label: "rinseCount" },
    { role: "delayEnd", icon: "mdi:timer-sand", label: "delayEnd" },
    { role: "bubbleSoak", icon: "mdi:chart-bubble", label: "bubbleSoak" },
    { role: "detergentAmount", icon: "mdi:cup-water", label: "detergentAmount" },
    { role: "softenerAmount", icon: "mdi:flower", label: "softenerAmount" },
  ],
  dryer: [
    { role: "dryLevel", icon: "mdi:water-percent", label: "dryLevel" },
    { role: "dryingTime", icon: "mdi:timer-outline", label: "dryingTime" },
    { role: "delayEnd", icon: "mdi:timer-sand", label: "delayEnd" },
    { role: "wrinklePrevent", icon: "mdi:tshirt-crew-outline", label: "wrinklePrevent" },
    { role: "autoCycleLink", icon: "mdi:link-variant", label: "autoCycleLink" },
  ],
};

const ICON = { washer: "mdi:washing-machine", dryer: "mdi:tumble-dryer" };
const DELAY_STEP = 60;

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function resolveDevice(hass, config) {
  if (config.device_id) return config.device_id;
  return hass.entities?.[config.entity]?.device_id;
}

// Snapshot of the appliance: role -> state object, plus derived status.
function readAppliance(hass, config) {
  const deviceId = resolveDevice(hass, config);
  const device = deviceId ? hass.devices?.[deviceId] : undefined;
  const ents = {};
  for (const entry of Object.values(hass.entities || {})) {
    if (entry.device_id !== deviceId || entry.platform !== "smartthings") continue;
    const role = ROLES[`${entry.entity_id.split(".")[0]}.${entry.translation_key}`];
    const stateObj = hass.states[entry.entity_id];
    if (role && stateObj && !ents[role]) ents[role] = stateObj;
  }
  const kind =
    ents.machineState?.entity_id && hass.entities[ents.machineState.entity_id].translation_key.startsWith("dryer")
      ? "dryer"
      : ents.cycle && hass.entities[ents.cycle.entity_id].translation_key === "dryer_cycle"
        ? "dryer"
        : "washer";
  const lang = (hass.locale?.language || hass.language || "en").startsWith("it") ? "it" : "en";
  const t = (k) => I18N[lang][k] ?? I18N.en[k] ?? k;

  const machine = ents.machineState?.state;
  const job = ents.jobState?.state;
  const available = machine !== undefined && machine !== "unavailable";
  const running = machine === "run";
  const paused = machine === "pause";
  const active = running || paused;
  const delayed = job === "delay_wash";
  const phases = PHASES[kind];
  const phaseIndex = active ? phases.findIndex((p) => p.states.includes(job)) : -1;
  const finished = !active && (job === "finish" || job === "finished");

  let remainingMin = null;
  let endsAt = null;
  const completion = ents.completion?.state;
  if (active && completion && !["unknown", "unavailable"].includes(completion)) {
    endsAt = new Date(completion);
    remainingMin = Math.max(0, Math.round((endsAt - Date.now()) / 60000));
  }

  let status;
  if (!available) status = t("unavailable");
  else if (delayed) status = t("delayed");
  else if (paused) status = t("paused");
  else if (running) status = phaseIndex >= 0 ? t(phases[phaseIndex].key) : t("running");
  else if (finished) status = t("finished");
  else status = t("ready");

  return {
    deviceId, device, ents, kind, lang, t, machine, job, available, running, paused, active,
    delayed, phases, phaseIndex, finished, remainingMin, endsAt, status,
    remoteOn: ents.remote ? ents.remote.state === "on" : true,
    name: device?.name_by_user || device?.name || t(kind),
  };
}

function formatDuration(min) {
  if (min == null) return "";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h} h ${String(m).padStart(2, "0")} min` : `${m} min`;
}

function formatClock(hass, date) {
  return date.toLocaleTimeString(hass.locale?.language || undefined, { hour: "2-digit", minute: "2-digit" });
}

function optionLabel(hass, role, stateObj, option) {
  let label = hass.formatEntityState ? hass.formatEntityState(stateObj, option) : option;
  if (label === option && /^\d+$/.test(option)) {
    if (role === "temperature") label = `${option} °C`;
    else if (role === "spin") label = `${option} rpm`;
    else if (role === "dryingTime") label = option === "0" ? "Auto" : `${option} min`;
  }
  return label;
}

const SHARED_CSS = `
  :host { --accent: var(--primary-color); }
  ha-icon { --mdc-icon-size: 24px; display: inline-flex; }
  button { font: inherit; color: inherit; border: none; background: none; cursor: pointer; padding: 0; }
  button:disabled { cursor: default; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 50% { opacity: .45; } }
`;

class SmartThingsLaundryCard extends HTMLElement {
  static getConfigForm() {
    return {
      schema: [
        { name: "device_id", required: true, selector: { device: { integration: "smartthings" } } },
        { name: "name", selector: { text: {} } },
      ],
    };
  }

  static getStubConfig(hass) {
    const entry = Object.values(hass.entities || {}).find(
      (e) => e.platform === "smartthings" && ["washer_machine_state", "dryer_machine_state"].includes(e.translation_key),
    );
    return { device_id: entry?.device_id || "" };
  }

  setConfig(config) {
    if (!config.device_id && !config.entity) throw new Error("Set device_id or entity");
    this._config = config;
    this._sig = null;
    if (this._hass) this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._dialog?.update(hass);
    this._render();
  }

  getCardSize() {
    return 1;
  }

  getGridOptions() {
    return { columns: 6, rows: 1, min_columns: 4, min_rows: 1 };
  }

  connectedCallback() {
    this._tick = setInterval(() => {
      this._sig = null;
      if (this._hass) this._render();
    }, 30000);
  }

  disconnectedCallback() {
    clearInterval(this._tick);
  }

  _render() {
    if (!this._config) return;
    const a = readAppliance(this._hass, this._config);
    const sig = JSON.stringify([
      a.name, a.status, a.remainingMin, a.phaseIndex, a.active, a.running, a.remoteOn, a.available, this._config.name,
    ]);
    if (sig === this._sig) return;
    this._sig = sig;
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.addEventListener("click", (ev) => this._onClick(ev));
    }
    const name = this._config.name || a.name;
    const secondary = a.active && a.remainingMin != null ? `${a.status} · ${formatDuration(a.remainingMin)}` : a.status;
    const canToggle = a.available && a.remoteOn && a.active && a.ents.operating;
    const segments = a.phases
      .map((_, i) => `<span class="seg ${i < a.phaseIndex ? "done" : i === a.phaseIndex ? "now" : ""}"></span>`)
      .join("");
    this.shadowRoot.innerHTML = `
      <style>
        ${SHARED_CSS}
        ha-card { height: 100%; box-sizing: border-box; cursor: pointer; overflow: hidden; }
        .row { display: flex; align-items: center; gap: 10px; padding: 10px; height: 100%; box-sizing: border-box; }
        .icon { position: relative; flex: none; width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center;
          color: var(--state-icon-color, var(--secondary-text-color));
          background: color-mix(in srgb, var(--secondary-text-color) 15%, transparent); }
        .icon.on { color: var(--accent); background: color-mix(in srgb, var(--accent) 20%, transparent); }
        .icon.on.running ha-icon { animation: pulse 2s ease-in-out infinite; }
        .info { flex: 1; min-width: 0; }
        .name { font-weight: 500; font-size: 14px; line-height: 20px; color: var(--primary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .state { font-size: 12px; line-height: 16px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .bar { display: ${a.active ? "flex" : "none"}; gap: 3px; margin-top: 4px; }
        .seg { flex: 1; height: 3px; border-radius: 2px; background: color-mix(in srgb, var(--secondary-text-color) 25%, transparent); }
        .seg.done { background: var(--accent); }
        .seg.now { background: var(--accent); animation: pulse 1.6s ease-in-out infinite; }
        .action { flex: none; width: 36px; height: 36px; border-radius: 10px; display: grid; place-items: center;
          background: color-mix(in srgb, var(--accent) 20%, transparent); color: var(--accent); }
      </style>
      <ha-card>
        <div class="row">
          <div class="icon ${a.active ? "on" : ""} ${a.running ? "running" : ""}"><ha-icon icon="${ICON[a.kind]}"></ha-icon></div>
          <div class="info">
            <div class="name">${esc(name)}</div>
            <div class="state">${esc(secondary)}</div>
            <div class="bar">${segments}</div>
          </div>
          ${canToggle ? `<button class="action" data-action="toggle" title="${esc(a.running ? a.t("pause") : a.t("resume"))}"><ha-icon icon="${a.running ? "mdi:pause" : "mdi:play"}"></ha-icon></button>` : ""}
        </div>
      </ha-card>`;
  }

  _onClick(ev) {
    const action = ev.target.closest("[data-action]")?.dataset.action;
    if (action === "toggle") {
      ev.stopPropagation();
      const a = readAppliance(this._hass, this._config);
      this._hass.callService("select", "select_option", {
        entity_id: a.ents.operating.entity_id,
        option: a.running ? "pause" : "run",
      });
      return;
    }
    this._openDialog();
  }

  _openDialog() {
    if (!this._dialog) {
      this._dialog = document.createElement("smartthings-laundry-dialog");
      this._dialog.addEventListener("closed", () => {
        this._dialog.remove();
        this._dialog = null;
      });
    }
    this._dialog.config = this._config;
    document.body.appendChild(this._dialog);
    this._dialog.update(this._hass);
  }
}

class SmartThingsLaundryDialog extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._open = null;
    this._busy = null;
    this._error = null;
    this.shadowRoot.addEventListener("click", (ev) => this._onClick(ev));
    this._onKey = (ev) => ev.key === "Escape" && this.close();
    this._onPop = () => this._dismiss();
  }

  connectedCallback() {
    document.addEventListener("keydown", this._onKey);
    // A history entry lets the back gesture close the dialog, as HA more-info does.
    history.pushState({ ...history.state, smartthingsLaundryDialog: true }, "");
    window.addEventListener("popstate", this._onPop);
    this._tick = setInterval(() => this._render(true), 30000);
  }

  disconnectedCallback() {
    document.removeEventListener("keydown", this._onKey);
    window.removeEventListener("popstate", this._onPop);
    clearInterval(this._tick);
  }

  update(hass) {
    this._hass = hass;
    this._render();
  }

  close() {
    if (history.state?.smartthingsLaundryDialog) history.back();
    else this._dismiss();
  }

  _dismiss() {
    this.dispatchEvent(new CustomEvent("closed"));
  }

  _render(force = false) {
    if (!this._hass || !this.config) return;
    const a = readAppliance(this._hass, this.config);
    const sig = JSON.stringify([
      Object.values(a.ents).map((s) => [s.entity_id, s.state, s.attributes.options]),
      this._open, this._busy, this._error, a.remainingMin,
    ]);
    if (!force && sig === this._sig) return;
    this._sig = sig;
    // The shell is built once: recreating it would replay the open animation.
    if (!this._shell) {
      this.shadowRoot.innerHTML = `<style>${SHARED_CSS}${DIALOG_CSS}</style>
        <div class="scrim" data-action="close"></div>
        <div class="dialog" role="dialog" aria-modal="true"></div>`;
      this._shell = this.shadowRoot.querySelector(".dialog");
    }
    const name = this.config.name || a.name;
    this._shell.setAttribute("aria-label", name);
    const scroll = this.shadowRoot.querySelector(".content")?.scrollTop ?? 0;
    this._shell.innerHTML = this._template(a, name);
    this.shadowRoot.querySelector(".content").scrollTop = scroll;
  }

  _template(a, name) {
    const { t } = a;
    const locked = a.active || !a.available;
    const ctlDisabled = !a.available || !a.remoteOn || !a.ents.operating;
    return `
        <div class="header">
          <button class="icon-btn" data-action="close" title="${esc(t("close"))}"><ha-icon icon="mdi:close"></ha-icon></button>
          <div class="title">
            <div class="name">${esc(name)}</div>
            ${name !== t(a.kind) ? `<div class="sub">${esc(t(a.kind))}</div>` : ""}
          </div>
          ${a.deviceId ? `<button class="icon-btn" data-action="device" title="${esc(t("device"))}"><ha-icon icon="mdi:cog-outline"></ha-icon></button>` : ""}
        </div>
        <div class="content">
          ${this._hero(a)}
          ${a.active ? this._stepper(a) : ""}
          <div class="controls">
            ${this._controlButtons(a, ctlDisabled)}
          </div>
          ${a.available && !a.remoteOn ? `<div class="banner"><ha-icon icon="mdi:remote-off"></ha-icon><span>${esc(t("remote_off"))}</span></div>` : ""}
          ${a.ents.childLock?.state === "on" ? `<div class="banner soft"><ha-icon icon="mdi:lock"></ha-icon><span>${esc(t("child_lock"))}</span></div>` : ""}
          ${this._error ? `<div class="banner error"><ha-icon icon="mdi:alert-circle-outline"></ha-icon><span>${esc(this._error)}</span></div>` : ""}
          ${a.ents.cycle ? this._programSection(a, locked || !a.remoteOn) : ""}
          ${this._optionsSection(a, locked)}
          ${this._suppliesSection(a)}
        </div>`;
  }

  _hero(a) {
    const { t } = a;
    const r = 88;
    const circ = 2 * Math.PI * r;
    const n = a.phases.length;
    const gap = 10;
    const segLen = circ / n - gap;
    const arcs = a.phases
      .map((_, i) => {
        const cls = !a.active ? "" : i < a.phaseIndex ? "done" : i === a.phaseIndex ? "now" : "";
        return `<circle class="arc ${cls}" r="${r}" cx="100" cy="100" stroke-dasharray="${segLen} ${circ - segLen}" stroke-dashoffset="${-(i * (circ / n)) - gap / 2}"></circle>`;
      })
      .join("");
    let big;
    let small;
    if (a.active && a.remainingMin != null) {
      big = formatDuration(a.remainingMin);
      small = a.endsAt ? `${t("ends_at")} ${formatClock(this._hass, a.endsAt)}` : t("left");
    } else {
      big = a.status;
      small = a.ents.cycle && a.available ? optionLabel(this._hass, "cycle", a.ents.cycle, a.ents.cycle.state) : "";
    }
    return `
      <div class="hero ${a.active ? "active" : ""} ${a.running ? "running" : ""}">
        <svg viewBox="0 0 200 200" aria-hidden="true"><g transform="rotate(-90 100 100)">${arcs}</g></svg>
        <div class="hero-inner">
          <div class="drum"><ha-icon icon="${ICON[a.kind]}"></ha-icon></div>
          <div class="big">${esc(big)}</div>
          <div class="small">${esc(a.active ? a.status : small)}</div>
          ${a.active && small ? `<div class="small muted">${esc(small)}</div>` : ""}
        </div>
      </div>`;
  }

  _stepper(a) {
    return `<div class="stepper">${a.phases
      .map((p, i) => {
        const cls = i < a.phaseIndex ? "done" : i === a.phaseIndex ? "now" : "";
        return `<div class="step ${cls}"><ha-icon icon="${i < a.phaseIndex ? "mdi:check" : p.icon}"></ha-icon><span>${esc(a.t(p.key))}</span></div>`;
      })
      .join('<div class="step-line"></div>')}</div>`;
  }

  _controlButtons(a, disabled) {
    const { t } = a;
    const busy = (k) => (this._busy === k ? " busy" : "");
    const main = a.running
      ? { opt: "pause", icon: "mdi:pause", label: t("pause") }
      : { opt: "run", icon: "mdi:play", label: a.paused ? t("resume") : t("start") };
    return `
      <button class="ctl primary${busy(main.opt)}" data-action="operate" data-option="${main.opt}" ${disabled ? "disabled" : ""}>
        <ha-icon icon="${main.icon}"></ha-icon><span>${esc(main.label)}</span>
      </button>
      <button class="ctl${busy("stop")}" data-action="operate" data-option="stop" ${disabled || !a.active ? "disabled" : ""}>
        <ha-icon icon="mdi:stop"></ha-icon><span>${esc(t("stop"))}</span>
      </button>`;
  }

  _programSection(a, locked) {
    const s = a.ents.cycle;
    const options = s.attributes.options || [];
    const open = this._open === "cycle" && !locked;
    return `
      <div class="section">
        <div class="section-title">${esc(a.t("program"))}${locked && a.active ? `<span class="hint">${esc(a.t("locked_running"))}</span>` : ""}</div>
        <button class="select-row ${open ? "open" : ""}" data-action="expand" data-role="cycle" ${locked ? "disabled" : ""}>
          <ha-icon icon="mdi:tune-variant"></ha-icon>
          <span class="grow">${esc(optionLabel(this._hass, "cycle", s, s.state))}</span>
          <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
        </button>
        ${open ? this._pills(a, "cycle", s, options, true) : ""}
      </div>`;
  }

  _pills(a, role, s, options, wide = false) {
    return `<div class="pills ${wide ? "wide" : ""}">${options
      .map(
        (o) =>
          `<button class="pill ${o === s.state ? "sel" : ""}${this._busy === `${role}:${o}` ? " busy" : ""}" data-action="select" data-role="${role}" data-option="${esc(o)}">${esc(optionLabel(this._hass, role, s, o))}</button>`,
      )
      .join("")}</div>`;
  }

  _optionsSection(a, locked) {
    const tiles = OPTION_TILES[a.kind].filter((tile) => a.ents[tile.role]);
    if (!tiles.length) return "";
    let panel = "";
    const html = tiles
      .map((tile) => {
        const s = a.ents[tile.role];
        const domain = s.entity_id.split(".")[0];
        const unavailable = s.state === "unavailable";
        // Supply amounts can change mid-cycle, cycle options cannot.
        const disabled = unavailable || (locked && !["detergentAmount", "softenerAmount"].includes(tile.role));
        const isOn = domain === "switch" && s.state === "on";
        let value;
        if (domain === "switch") value = isOn ? "On" : "Off";
        else if (tile.role === "delayEnd") value = Number(s.state) > 0 ? formatDuration(Number(s.state)) : a.t("off");
        else if (domain === "number") value = s.state;
        else value = unavailable ? "-" : optionLabel(this._hass, tile.role, s, s.state);
        const open = this._open === tile.role && !disabled;
        if (open) panel = this._optionPanel(a, tile, s);
        const action = domain === "switch" ? "toggle-switch" : "expand";
        return `
          <button class="tile ${isOn ? "on" : ""} ${open ? "open" : ""}${this._busy === tile.role ? " busy" : ""}" data-action="${action}" data-role="${tile.role}" ${disabled ? "disabled" : ""}>
            <ha-icon icon="${tile.icon}"></ha-icon>
            <span class="tile-text"><span class="tile-label">${esc(a.t(tile.label))}</span><span class="tile-value">${esc(value)}</span></span>
          </button>`;
      })
      .join("");
    return `
      <div class="section">
        <div class="section-title">${esc(a.t("options"))}</div>
        <div class="tiles">${html}</div>
        ${panel}
      </div>`;
  }

  _optionPanel(a, tile, s) {
    const domain = s.entity_id.split(".")[0];
    if (domain === "select") return this._pills(a, tile.role, s, s.attributes.options || []);
    const min = Number(s.attributes.min ?? 0);
    const max = Number(s.attributes.max ?? 100);
    const step = tile.role === "delayEnd" ? DELAY_STEP : Number(s.attributes.step ?? 1);
    const value = Number(s.state) || 0;
    const shown =
      tile.role === "delayEnd"
        ? value > 0
          ? `${a.t("in")} ${formatDuration(value)}`
          : a.t("off")
        : String(value);
    return `
      <div class="stepper-ctl">
        <button class="round" data-action="number" data-role="${tile.role}" data-value="${Math.max(min, value - step)}" ${value <= min ? "disabled" : ""}><ha-icon icon="mdi:minus"></ha-icon></button>
        <div class="num">${esc(shown)}</div>
        <button class="round" data-action="number" data-role="${tile.role}" data-value="${Math.min(max, value + step)}" ${value >= max ? "disabled" : ""}><ha-icon icon="mdi:plus"></ha-icon></button>
      </div>`;
  }

  _suppliesSection(a) {
    const items = [
      ["detergent", "mdi:cup-water"],
      ["softener", "mdi:flower"],
    ].filter(([role]) => a.ents[role] && !["unknown", "unavailable"].includes(a.ents[role].state));
    if (!items.length) return "";
    return `
      <div class="section">
        <div class="section-title">${esc(a.t("supplies"))}</div>
        <div class="chips">${items
          .map(([role, icon]) => {
            const s = a.ents[role];
            const warn = ["empty", "less"].includes(s.state);
            const label = this._hass.formatEntityState ? this._hass.formatEntityState(s) : s.state;
            return `<div class="chip ${warn ? "warn" : ""}"><ha-icon icon="${warn ? "mdi:alert" : icon}"></ha-icon>${esc(a.t(role))}: ${esc(label)}</div>`;
          })
          .join("")}</div>
      </div>`;
  }

  async _call(busyKey, domain, service, data) {
    this._busy = busyKey;
    this._error = null;
    this._render();
    try {
      await this._hass.callService(domain, service, data);
    } catch (err) {
      this._error = err?.message || String(err);
    }
    this._busy = null;
    this._render(true);
  }

  _onClick(ev) {
    const el = ev.target.closest("[data-action]");
    if (!el || el.disabled) return;
    const a = readAppliance(this._hass, this.config);
    const { action, role, option, value } = el.dataset;
    switch (action) {
      case "close":
        this.close();
        break;
      case "device":
        history.replaceState(null, "", `/config/devices/device/${a.deviceId}`);
        this._dismiss();
        window.dispatchEvent(new CustomEvent("location-changed"));
        break;
      case "operate":
        this._call(option, "select", "select_option", { entity_id: a.ents.operating.entity_id, option });
        break;
      case "expand":
        this._open = this._open === role ? null : role;
        this._render(true);
        break;
      case "select":
        this._open = role === "cycle" ? null : this._open;
        this._call(`${role}:${option}`, "select", "select_option", { entity_id: a.ents[role].entity_id, option });
        break;
      case "number":
        this._call(role, "number", "set_value", { entity_id: a.ents[role].entity_id, value: Number(value) });
        break;
      case "toggle-switch":
        this._call(role, "switch", "toggle", { entity_id: a.ents[role].entity_id });
        break;
    }
  }
}

const DIALOG_CSS = `
  :host { position: fixed; inset: 0; z-index: 7; display: flex; align-items: center; justify-content: center;
    font-family: var(--ha-font-family-body, Roboto, sans-serif); color: var(--primary-text-color); }
  .scrim { position: absolute; inset: 0; background: rgba(0, 0, 0, .45); animation: fade .15s ease-out; }
  @keyframes fade { from { opacity: 0; } }
  @keyframes rise { from { transform: translateY(24px); opacity: 0; } }
  .dialog { position: relative; width: min(460px, 100vw); max-height: min(90vh, 860px); display: flex; flex-direction: column;
    background: var(--ha-dialog-surface-background, var(--card-background-color, #fff)); border-radius: var(--ha-dialog-border-radius, 28px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, .3); overflow: hidden; animation: rise .2s ease-out; }
  @media (max-width: 600px) {
    :host { align-items: flex-end; }
    .dialog { width: 100vw; max-height: 94vh; border-radius: 28px 28px 0 0; }
  }
  .header { display: flex; align-items: center; gap: 4px; padding: 12px 12px 4px; }
  .title { flex: 1; min-width: 0; padding: 0 4px; }
  .title .name { font-size: 20px; line-height: 26px; font-weight: 400; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .title .sub { font-size: 13px; color: var(--secondary-text-color); }
  .icon-btn { width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center; color: var(--primary-text-color); }
  .icon-btn:hover { background: color-mix(in srgb, var(--primary-text-color) 8%, transparent); }
  .content { overflow-y: auto; padding: 0 24px 24px; }

  .hero { position: relative; width: 240px; max-width: 70vw; aspect-ratio: 1; margin: 8px auto 12px; }
  .hero svg { width: 100%; height: 100%; }
  .arc { fill: none; stroke-width: 12; stroke-linecap: round; stroke: color-mix(in srgb, var(--secondary-text-color) 18%, transparent); transition: stroke .3s; }
  .arc.done { stroke: var(--accent); }
  .arc.now { stroke: var(--accent); animation: pulse 1.6s ease-in-out infinite; }
  .hero-inner { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 0 36px; }
  .drum { width: 56px; height: 56px; border-radius: 50%; display: grid; place-items: center; margin-bottom: 6px;
    color: var(--secondary-text-color); background: color-mix(in srgb, var(--secondary-text-color) 12%, transparent); }
  .drum ha-icon { --mdc-icon-size: 32px; }
  .hero.active .drum { color: var(--accent); background: color-mix(in srgb, var(--accent) 18%, transparent); }
  .hero.running .drum ha-icon { animation: pulse 2s ease-in-out infinite; }
  .big { font-size: 28px; line-height: 34px; font-weight: 500; }
  .small { font-size: 14px; color: var(--primary-text-color); margin-top: 2px; }
  .small.muted { color: var(--secondary-text-color); font-size: 13px; }

  .stepper { display: flex; align-items: center; justify-content: center; margin: 0 0 16px; }
  .step { display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 12px; color: var(--secondary-text-color); min-width: 72px; }
  .step ha-icon { width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center; --mdc-icon-size: 18px;
    background: color-mix(in srgb, var(--secondary-text-color) 12%, transparent); }
  .step.done, .step.now { color: var(--primary-text-color); }
  .step.done ha-icon { background: var(--accent); color: var(--text-primary-color, #fff); }
  .step.now ha-icon { background: color-mix(in srgb, var(--accent) 25%, transparent); color: var(--accent); outline: 2px solid var(--accent); }
  .step-line { flex: 1; max-width: 40px; height: 2px; margin-bottom: 20px; background: color-mix(in srgb, var(--secondary-text-color) 25%, transparent); }

  .controls { display: flex; gap: 12px; justify-content: center; margin-bottom: 16px; }
  .ctl { flex: 1; max-width: 180px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; gap: 8px;
    font-size: 15px; font-weight: 500; background: color-mix(in srgb, var(--primary-text-color) 8%, transparent); transition: background .15s, opacity .15s; }
  .ctl.primary { background: var(--accent); color: var(--text-primary-color, #fff); }
  .ctl:not(:disabled):hover { filter: brightness(1.08); }
  .ctl:disabled { opacity: .38; }

  .busy { pointer-events: none; animation: pulse 1s ease-in-out infinite; }
  .banner { display: flex; gap: 10px; align-items: flex-start; padding: 12px 14px; margin-bottom: 12px; border-radius: 12px; font-size: 13px; line-height: 18px;
    background: color-mix(in srgb, var(--warning-color, #ffa600) 16%, transparent); }
  .banner ha-icon { color: var(--warning-color, #ffa600); flex: none; --mdc-icon-size: 20px; }
  .banner.soft { background: color-mix(in srgb, var(--secondary-text-color) 10%, transparent); }
  .banner.soft ha-icon { color: var(--secondary-text-color); }
  .banner.error { background: color-mix(in srgb, var(--error-color, #db4437) 14%, transparent); }
  .banner.error ha-icon { color: var(--error-color, #db4437); }

  .section { margin-top: 16px; }
  .section-title { font-size: 14px; font-weight: 500; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
  .hint { font-size: 12px; font-weight: 400; color: var(--secondary-text-color); }
  .select-row { width: 100%; display: flex; align-items: center; gap: 12px; padding: 0 16px; height: 56px; border-radius: 16px; text-align: left;
    background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
  .select-row ha-icon:first-child { color: var(--accent); }
  .select-row .grow { flex: 1; font-size: 15px; }
  .select-row .chev { transition: transform .2s; color: var(--secondary-text-color); }
  .select-row.open .chev { transform: rotate(180deg); }
  .select-row:disabled { opacity: .5; }

  .pills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
  .pills.wide { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
  .pill { padding: 8px 14px; min-height: 36px; border-radius: 18px; font-size: 13px; text-align: center;
    border: 1px solid var(--divider-color, rgba(0,0,0,.12)); }
  .pill:hover { background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
  .pill.sel { background: color-mix(in srgb, var(--accent) 20%, transparent); border-color: var(--accent); color: var(--primary-text-color); font-weight: 500; }

  .tiles { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .tile { display: flex; align-items: center; gap: 10px; padding: 10px 12px; min-height: 56px; border-radius: 16px; text-align: left;
    background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); transition: background .15s; }
  .tile ha-icon { flex: none; color: var(--secondary-text-color); }
  .tile.on ha-icon, .tile.open ha-icon { color: var(--accent); }
  .tile.on { background: color-mix(in srgb, var(--accent) 16%, transparent); }
  .tile.open { outline: 2px solid var(--accent); }
  .tile:disabled { opacity: .45; }
  .tile-text { display: flex; flex-direction: column; min-width: 0; }
  .tile-label { font-size: 12px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tile-value { font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .stepper-ctl { display: flex; align-items: center; justify-content: center; gap: 24px; margin-top: 12px; }
  .round { width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center;
    background: color-mix(in srgb, var(--primary-text-color) 8%, transparent); }
  .round:disabled { opacity: .38; }
  .num { min-width: 110px; text-align: center; font-size: 18px; font-weight: 500; }

  .chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 16px; font-size: 13px;
    background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
  .chip ha-icon { --mdc-icon-size: 18px; color: var(--secondary-text-color); }
  .chip.warn ha-icon { color: var(--warning-color, #ffa600); }
`;

customElements.define("smartthings-laundry-card", SmartThingsLaundryCard);
customElements.define("smartthings-laundry-dialog", SmartThingsLaundryDialog);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "smartthings-laundry-card",
  name: "Lavatrice e asciugatrice (SmartThings)",
  description: "Samsung washer and dryer with a more-info style control dialog.",
  preview: false,
});

console.info(`%c SMARTTHINGS-LAUNDRY-CARD %c ${VERSION} `, "background:#03a9f4;color:#fff", "");
