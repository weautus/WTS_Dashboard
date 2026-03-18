// Reusable emoji picker component
// Usage: initEmojiPicker(buttonEl, hiddenInputEl)

export const EMOJI_CATEGORIES = [
  {
    name: 'Smileys',
    icon: '😀',
    emojis: [
      '😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍',
      '🥰','😘','😗','😙','😚','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔',
      '🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','🤥','😔','😪','🤤','😴','😷',
      '🤒','🤕','🤢','🤮','🤧','🥵','🥶','🥴','😵','🤯','😎','🥸','🤩','🥳','😕',
      '😟','😞','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','😈','👿',
      '💀','☠️','💩','🤡','👹','👺','👻','👽','👾','🤖',
    ],
  },
  {
    name: 'People',
    icon: '👋',
    emojis: [
      '👋','🤚','🖐️','✋','🖖','👌','🤌','✌️','🤞','🤟','🤘','🤙','👈','👉','👆',
      '👇','☝️','👍','👎','✊','👊','🤛','🤜','🤝','👏','🙌','👐','🤲','💪','🦾',
      '👂','🦻','👃','👁️','👀','🧠','🦷','🦴','👤','👥','👦','👧','🧑','👨','👩',
      '🧓','👴','👵','👮','🕵️','💂','🥷','👷','🫅','🤴','👸','🧙','🧚','🧛','🧜',
      '🧝','🦸','🦹','🤶','🎅','🧑‍🏫','🧑‍⚕️','🧑‍🍳','🧑‍💻','🧑‍🚀','🧑‍🎤','🧑‍🎨',
      '🧑‍🔬','🏃','🚶','🧍','🧎','🤸','🏋️','🧘','🏊','🚴','🧗',
    ],
  },
  {
    name: 'Animals',
    icon: '🐶',
    emojis: [
      '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵',
      '🙈','🙉','🙊','🐔','🐧','🐦','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝',
      '🪱','🐛','🦋','🐌','🐞','🐜','🦟','🦗','🪲','🕷️','🦂','🐢','🐍','🦎','🦖',
      '🦕','🐊','🐉','🐲','🦕','🐡','🐠','🐟','🐬','🦭','🐋','🦈','🦑','🐙','🦞',
      '🦀','🦐','🦪','🐚','🐌','🦜','🦚','🦩','🦢','🕊️','🐓','🦃','🦤','🦦','🦥',
      '🦔','🐾',
    ],
  },
  {
    name: 'Nature',
    icon: '🌿',
    emojis: [
      '🌸','🌺','🌻','🌹','🌷','💐','🍀','☘️','🌿','🌱','🌲','🌳','🌴','🪴','🌵',
      '🎋','🎄','🌾','🍁','🍂','🍃','🪸','🪨','🪵','🌍','🌎','🌏','🌙','⭐','🌟',
      '💫','⚡','🌈','☀️','🌤️','⛅','🌥️','☁️','🌦️','🌧️','⛈️','🌩️','🌨️','❄️',
      '🌪️','🌫️','🌬️','🌀','☔','🌊','💧','💦','🔥','🌑','🌒','🌓','🌔','🌕',
      '🌖','🌗','🌘','🌙','🌚','🌛','🌜','🌝','🌞','🪐','💥','🌠','🌌','🌄','🌅',
      '🌃','🏔️','⛰️','🌋','🗻','🏕️','🏖️','🏜️','🏝️','🏞️',
    ],
  },
  {
    name: 'Food',
    icon: '🍎',
    emojis: [
      '🍎','🍊','🍋','🍇','🍓','🫐','🍈','🍑','🍒','🥝','🍅','🫒','🥥','🥑','🍆',
      '🥦','🥬','🥒','🌶️','🫑','🧅','🧄','🥔','🌽','🥕','🍄','🫘','🌰','🥜','🍞',
      '🥐','🥖','🫓','🥨','🧀','🥚','🍳','🧈','🥞','🧇','🥓','🥩','🍗','🍖','🌭',
      '🍔','🍟','🍕','🫔','🌮','🌯','🥙','🧆','🍝','🍜','🍲','🍛','🍣','🍱','🥟',
      '🍤','🍙','🍚','🍘','🍥','🥮','🍡','🧁','🍰','🎂','🍮','🍭','🍬','🍫','🍿',
      '🍩','🍪','☕','🍵','🧃','🥤','🧋','🍺','🍻','🥂','🍷','🥃','🍸','🍹','🧉',
    ],
  },
  {
    name: 'Activities',
    icon: '⚽',
    emojis: [
      '⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🥏','🏓','🏸','🏒','🥍','🏑','🏏',
      '⛳','🎣','🤿','🥊','🥋','🎯','🛹','🛷','🎱','🏹','🎸','🎺','🥁','🎻','🎹',
      '🎵','🎶','🎼','🎤','🎧','🎙️','🎬','🎭','🎨','🖼️','🎠','🎡','🎢','🎟️','🎪',
      '🎀','🎁','🎊','🎉','🎇','🎆','🧨','✨','🎈','🎏','🏆','🥇','🥈','🥉','🏅',
      '🎖️','🎗️','🎮','🕹️','🎲','🧩','🎴','🀄','♟️','🧸','🪆','🪅','🎭','🎪',
    ],
  },
  {
    name: 'Travel',
    icon: '✈️',
    emojis: [
      '🚗','🚕','🚙','🚌','🚎','🏎️','🚓','🚑','🚒','🚐','🚚','🚛','🚜','🛻','🏍️',
      '🚲','🛴','🛵','🛺','🚁','✈️','🛫','🛬','🛩️','💺','🚀','🛸','🛳️','⛴️','🛥️',
      '🚢','🚤','⛵','🚣','🛶','⚓','🗺️','🧭','🏠','🏡','🏢','🏣','🏤','🏥','🏦',
      '🏨','🏩','🏪','🏫','🏬','🏭','🏯','🏰','💒','🗼','🗽','⛪','🕌','🕍','⛩️',
      '🕋','⛲','⛺','🌁','🌃','🌆','🌇','🌉','🌌','🎠','🌅','🌄','🗾','🏔️','🌋',
    ],
  },
  {
    name: 'Objects',
    icon: '💡',
    emojis: [
      '💡','🔦','🕯️','🪔','💻','🖥️','🖨️','⌨️','🖱️','💾','💿','📀','📱','📲','📷',
      '📸','📹','🎥','📽️','🎞️','📞','☎️','📺','📻','🎙️','🎚️','🎛️','🧭','⏱️','⏲️',
      '⏰','🕰️','⌛','⏳','📡','🔋','🪫','🔌','🧱','🔮','🪄','🔭','🔬','💊','💉',
      '🩺','🩹','🩻','🩼','🪥','🪒','🧴','🧹','🧺','🧻','🪣','🧼','🧽','🧯','🛒',
      '📦','📝','✏️','✒️','🖊️','📚','📖','🔖','🏷️','💰','💳','💹','🔑','🗝️','🔨',
      '🪓','⛏️','🔧','🪛','🔩','⚙️','🧲','🪜','🪞','🪟','🛋️','🪑','🚪','🧳',
    ],
  },
  {
    name: 'Symbols',
    icon: '❤️',
    emojis: [
      '❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗',
      '💖','💘','💝','💟','☮️','✝️','☪️','🕉️','☸️','✡️','🔯','☯️','♈','♉','♊',
      '♋','♌','♍','♎','♏','♐','♑','♒','♓','⛎','⚜️','🔱','📛','🔰','♻️','✅',
      '❎','🚫','⛔','🔝','🔛','🔜','🔙','🔚','⬆️','⬇️','⬅️','➡️','↗️','↖️','↘️',
      '↙️','↕️','↔️','↩️','↪️','⤴️','⤵️','🔀','🔁','🔂','▶️','⏭️','⏮️','⏸️','⏹️',
      '⏺️','🔔','🔕','🔊','📢','📣','💯','✔️','❌','❓','❗','⭕','🔴','🟠','🟡',
      '🟢','🔵','🟣','⚫','⚪','🟤','🔶','🔷','🔸','🔹','🔺','🔻','💠','🔘','🔲',
    ],
  },
];

// ---- DOM construction ----

let activePickerClose = null; // close the current open picker

export function initEmojiPicker(triggerBtn, hiddenInput) {
  // Build modal on first open (lazy)
  let modal = null;
  let activeCategory = 0;

  function buildModal() {
    modal = document.createElement('div');
    modal.className = 'emoji-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Choose an emoji');

    const backdrop = document.createElement('div');
    backdrop.className = 'emoji-backdrop';
    backdrop.addEventListener('click', closeModal);

    const panel = document.createElement('div');
    panel.className = 'emoji-panel';

    // Header
    const header = document.createElement('div');
    header.className = 'emoji-panel__header';
    header.innerHTML = '<span>Pick an emoji</span>';
    const closeBtn = document.createElement('button');
    closeBtn.className = 'emoji-panel__close';
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', closeModal);
    header.appendChild(closeBtn);

    // Tabs
    const tabs = document.createElement('div');
    tabs.className = 'emoji-tabs';
    EMOJI_CATEGORIES.forEach((cat, i) => {
      const btn = document.createElement('button');
      btn.className = 'emoji-tab' + (i === 0 ? ' emoji-tab--active' : '');
      btn.title = cat.name;
      btn.textContent = cat.icon;
      btn.dataset.index = i;
      btn.addEventListener('click', () => {
        tabs.querySelectorAll('.emoji-tab').forEach(b => b.classList.remove('emoji-tab--active'));
        btn.classList.add('emoji-tab--active');
        activeCategory = i;
        renderGrid();
      });
      tabs.appendChild(btn);
    });

    // Grid
    const grid = document.createElement('div');
    grid.className = 'emoji-grid';

    function renderGrid() {
      grid.innerHTML = '';
      EMOJI_CATEGORIES[activeCategory].emojis.forEach(emoji => {
        const btn = document.createElement('button');
        btn.className = 'emoji-btn';
        btn.textContent = emoji;
        btn.addEventListener('click', () => {
          hiddenInput.value = emoji;
          triggerBtn.textContent = emoji;
          triggerBtn.classList.add('emoji-trigger--selected');
          closeModal();
        });
        grid.appendChild(btn);
      });
    }

    renderGrid();

    panel.appendChild(header);
    panel.appendChild(tabs);
    panel.appendChild(grid);

    modal.appendChild(backdrop);
    modal.appendChild(panel);
    document.body.appendChild(modal);
  }

  function openModal() {
    // Close any other open picker
    if (activePickerClose && activePickerClose !== closeModal) activePickerClose();
    if (!modal) buildModal();
    modal.classList.add('emoji-modal--open');
    activePickerClose = closeModal;
    // Trap focus
    modal.querySelector('.emoji-panel__close').focus();
  }

  function closeModal() {
    if (modal) modal.classList.remove('emoji-modal--open');
    activePickerClose = null;
  }

  // Keyboard: Escape closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('emoji-modal--open')) closeModal();
  });

  triggerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (modal?.classList.contains('emoji-modal--open')) closeModal();
    else openModal();
  });

  // Init button state
  if (hiddenInput.value) {
    triggerBtn.textContent = hiddenInput.value;
    triggerBtn.classList.add('emoji-trigger--selected');
  }
}
