<template>
  <div class="h-screen w-screen app-bg">
    <div class="flex h-full">
      <!-- SIDE MENU (responsive) -->
      <!-- Overlay for small screens -->
      <div v-if="ui.sideOpen" class="fixed inset-0 bg-black/50 md:hidden" @click="closeSide()"></div>
      <aside
        class="z-20 md:relative md:z-0 h-full side-rail backdrop-blur transition-all duration-300 overflow-hidden"
        :class="sideClass"
      >
        <div class="h-full flex flex-col">
          <div class="flex items-center justify-between px-3 py-3">
            <div class="flex items-center gap-2 font-semibold">
              <span class="hidden md:inline">ToDojo</span>
            </div>
            <button class="btn-ghost md:hidden" @click="closeSide" aria-label="Close menu">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6l-12 12"/></svg>
            </button>
          </div>

          <nav class="p-2 space-y-1 text-sm">
            <button class="menu-item w-full flex items-center gap-2" :class="{ 'is-active': tab==='history' }" @click="openFromSide('history')">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
              <span>History</span>
            </button>
            <button class="menu-item w-full flex items-center gap-2" :class="{ 'is-active': tab==='flows' }" @click="openFromSide('flows')">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h12l-2-2M21 17H9l2 2"/></svg>
              <span>Flows</span>
            </button>

            <div class="divider"></div>

            <button class="menu-item w-full flex items-center gap-2" :class="{ 'is-active': tab==='settings' }" @click="openFromSide('settings')">
              <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V22a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 7 20.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 3.4 15a1.65 1.65 0 0 0-1.51-1H2a2 2 0 1 1 0-4h-.09A1.65 1.65 0 0 0 3.4 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 5.84 4.3l.06.06A1.65 1.65 0 0 0 7.72 4a1.65 1.65 0 0 0 1-1.51V2a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 3.6c.5.2 1 .5 1.38.88l.06.06a2 2 0 1 1 2.83 2.83l-.06.06c-.38.38-.68.86-.88 1.38.16.49.25 1.01.25 1.53s-.09 1.04-.25 1.53Z"/></svg>
              <span>Settings</span>
            </button>
          </nav>
        </div>
      </aside>

      <!-- MAIN COLUMN -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- TOP BAR -->
        <div class="flex items-center justify-between px-3 py-2 bg-surface">
          <div class="flex items-center gap-2">
            <button class="btn-ghost md:hidden" @click="ui.sideOpen = true" aria-label="Open menu">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
            </button>
            <!-- Desktop side toggle on the left -->
            <button class="btn-ghost hidden md:inline-flex" @click="toggleSideMd" title="Toggle menu" aria-label="Toggle side menu">
              <svg v-if="ui.sideOpen" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              <svg v-else class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
            </button>
            <h1 class="text-lg font-semibold">
              <span v-if="tab==='lists'">Lists</span>
              <span v-else-if="tab==='flows'">Flows</span>
              <span v-else-if="tab==='history'">History</span>
              <span v-else-if="tab==='settings'">Settings</span>
              <span v-else>Statistics</span>
            </h1>
          </div>
          <div></div>
        </div>

        <!-- CONTENT AREA -->
        <div class="flex-1 overflow-hidden">
          <!-- LISTS TAB -->
          <div v-if="tab==='lists'" class="h-full">
            <section class="h-full">
              <div class="flex gap-3 h-full overflow-x-auto snap-x snap-mandatory px-3 pb-3 pt-3">
                <!-- List card -->
                <div
                  v-for="list in lists"
                  :key="list.id"
                  class="relative snap-center shrink-0 surface rounded-2xl shadow p-3 flex flex-col list-card list-element"
                  :class="cardWidth"
                >
              <!-- header -->
              <div class="list-header flex items-center justify-between mb-2">
                <h2 class="font-semibold truncate">{{ list.title }}</h2>
                <div class="relative">
                  <button class="btn-ghost" @click="toggleListActions(list.id)" aria-label="List actions">
                    <svg class="icon" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                  </button>
                  <div
                    v-if="ui.listActionsId===list.id"
                    class="menu-pop right"
                  >
                    <button class="menu-item" @click="renameList(list)">Edit</button>
                    <button class="menu-item danger" @click="removeList(list.id)">Delete</button>
                  </div>
                </div>
              </div>

              <!-- tasks area container (fills available height) -->
              <div class="task-area overflow-hidden">
              <!-- tasks (active only) -->
              <ul class="h-full overflow-y-auto overflow-x-hidden scrollbar-left pl-1 vlist list-scroll" @scroll="onListScrollDeferred($event)">
                <li
                  v-for="t in list.tasks"
                  :key="t.id"
                  class="group relative flex items-center gap-2 px-2 py-1 task-item snap-start"
                  :class="[ t.fromFlowId ? 'flow-task' : '', ui.completing[t.id] ? 'completing' : '' ]"
                >
                  <!-- actions menu on the left -->
                  <div class="relative order-1 w-7 shrink-0 flex justify-center" style="margin-left:-8px">
                    <button class="btn-ghost" @click="toggleTaskActions(t.id)" aria-label="Task actions">
                      <svg class="icon" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                    </button>
                    <div v-if="ui.taskActionsId===t.id" class="menu-pop left">
                      <button class="menu-item" @click="editTask(list, t)">Edit</button>
                      <button class="menu-item danger" @click="removeTask(list, t.id)">Delete</button>
                    </div>
                  </div>

                  <!-- title in the middle -->
                  <button class="flex-1 order-2 text-left leading-tight truncate" @click="toggleTaskActions(t.id)">
                    {{ t.title }}
                  </button>

                  <!-- checkbox on the right -->
                  <input class="order-3" type="checkbox" :checked="false" :disabled="ui.completing[t.id]" @change="completeTask(list, t, $event)" />

                <!-- celebration overlay at task level -->
                <div v-if="ui.celebrateTaskId===t.id" class="celebrate-overlay">
                  <span v-for="n in 10" :key="'ray-'+t.id+'-'+n" class="ray" :style="rayStyle(n)"></span>
                </div>
                </li>
              </ul>
              </div>

              <!-- list footer: pinned to bottom of list element, always visible -->
              <div :id="'add-anchor-'+list.id" class="add-footer list-footer group px-2" @click="toggleAddMenu(list.id)">
                <div class="new-btn w-full">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                  <span>New</span>
                </div>

                <!-- anchored add menu (flush to button top edge) -->
              <div
                v-if="ui.listAddMenuId===list.id"
                :id="'add-menu-'+list.id"
                class="menu-fab full menu-up space-y-2"
                @click.stop
              >
                  <div class="flex gap-2 px-1">
                    <button class="btn-outline flex-1" :class="ui.addMode==='task' ? 'is-active' : ''" @click.stop="setAddMode('task')">Task</button>
                    <button class="btn-outline flex-1" :class="ui.addMode==='flow' ? 'is-active' : ''" @click.stop="setAddMode('flow')">Flow</button>
                  </div>

                  <div v-if="ui.addMode==='task'" class="space-y-2">
                    <label class="block text-xs text-sec px-2">Task Title</label>
                    <input
                      v-model.trim="ui.newTaskTitle"
                      class="field"
                      @focus="onTaskTitleFocus"
                      @blur="onTaskTitleBlur"
                    />
                    <div class="flex justify-end gap-2">
                      <button class="btn-primary" :disabled="!ui.newTaskTitle" @click.stop="addTaskWithTitle(list)">Add Task</button>
                    </div>
                  </div>

                  <div v-else class="space-y-2">
                    <label class="block text-xs text-sec px-2">Choose Flow</label>
                    <select v-model="ui.selectedFlowId" class="field">
                      <option disabled value="">Choose a flow…</option>
                      <option v-for="f in flows" :key="f.id" :value="f.id">{{ f.title }}</option>
                    </select>
                    <div class="flex justify-end gap-2">
                      <button class="btn-primary" :disabled="!ui.selectedFlowId" @click.stop="addFlowToList(list, ui.selectedFlowId)">Add Flow</button>
                    </div>
              </div>
            </div>
              </div>
            </div>

            <!-- add new list (full card size, subtle) -->
            <button
              class="relative snap-center shrink-0 muted-tile rounded-2xl shadow p-3 flex flex-col"
              :class="cardWidth"
              @click="addList"
              title="Add list"
            >
              <div class="flex-1 grid place-content-center text-muted hover:text-primary">
                <div class="flex items-center gap-2">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                  <span class="text-sm">New List</span>
                </div>
              </div>
            </button>
          </div>
            </section>
          </div>

          <!-- FLOWS TAB -->
          <div v-else-if="tab==='flows'" class="h-full">
            <section class="h-full">
              <div class="flex gap-3 h-full overflow-x-auto snap-x snap-mandatory px-3 pb-3 pt-3">
                <div
                  v-for="flow in flows"
                  :key="flow.id"
                  class="relative snap-center shrink-0 surface rounded-2xl shadow p-3 flex flex-col"
                  :class="cardWidth"
                >
                  <!-- flow header -->
                  <div class="flex items-center justify-between mb-2">
                    <h2 class="font-semibold truncate">{{ flow.title }}</h2>
                    <div class="relative">
                      <button class="btn-ghost" @click="toggleFlowActions(flow.id)" aria-label="Flow actions">
                        <svg class="icon" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                      </button>
                      <div v-if="ui.flowActionsId===flow.id" class="menu-pop right">
                        <button class="menu-item" @click="renameFlow(flow)">Edit</button>
                        <button class="menu-item danger" @click="removeFlow(flow.id)">Delete</button>
                      </div>
                    </div>
                  </div>

                  <!-- steps -->
                  <div class="flex-1 overflow-y-auto overflow-x-hidden scrollbar-left pl-1 space-y-3">
                    <div v-for="(step, idx) in flow.steps" :key="step.id" class="elev rounded-lg p-2 transition">
                      <div class="flex items-center justify-between mb-2">
                        <div class="text-xs text-sec">Step {{ idx+1 }} — type: single</div>
                        <div class="relative">
                          <button class="btn-ghost" @click="toggleStepActions(step.id)" aria-label="Step actions">
                            <svg class="icon" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                          </button>
                          <div v-if="ui.stepActionsId===step.id" class="menu-pop right">
                            <button class="menu-item" @click="renameStep(step)">Edit</button>
                            <button class="menu-item danger" @click="deleteStep(flow, step.id)">Delete</button>
                          </div>
                        </div>
                      </div>

                      <!-- single-task area -->
                      <div v-if="!step.taskTitle" class="flex justify-end">
                        <button class="btn-primary" @click="addStepTask(step)">
                          + Add task
                        </button>
                      </div>
                      <div v-else class="flex items-center gap-2">
                        <span class="flex-1 px-2 py-1 border border-div rounded">{{ step.taskTitle }}</span>
                        <!-- task actions in step -->
                        <div class="relative">
                          <button class="btn-ghost" @click="toggleStepTaskActions(step.id)" aria-label="Step task actions">
                            <svg class="icon" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                          </button>
                          <div v-if="ui.stepTaskActionsId===step.id" class="menu-pop right">
                            <button class="menu-item" @click="renameStepTask(step)">Edit</button>
                            <button class="menu-item danger" @click="removeStepTask(step)">Delete</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- add step -->
                  <div class="absolute bottom-3 right-3">
                    <button class="fab" @click="addStep(flow)" aria-label="Add step">
                      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                    </button>
                  </div>
                </div>

                <!-- add new flow (full card size, subtle) -->
                 <button
                  class="relative snap-center shrink-0 muted-tile rounded-2xl shadow p-3 flex flex-col"
                  :class="cardWidth"
                  @click="addFlow"
                >
                  <div class="flex-1 grid place-content-center text-muted hover:text-primary">
                    <div class="flex items-center gap-2">
                      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                      <span class="text-sm">New Flow</span>
                    </div>
                  </div>
                </button>
              </div>
            </section>
          </div>

          <!-- HISTORY TAB -->
          <div v-else-if="tab==='history'" class="h-full">
            <section class="h-full">
              <div class="flex gap-3 h-full overflow-x-auto snap-x snap-mandatory px-3 pb-3 pt-3">
                <div
                  v-for="lid in allListIds"
                  :key="lid + '-history'"
                  class="relative snap-center shrink-0 surface rounded-2xl shadow p-3 flex flex-col"
                  :class="cardWidth"
                >
                  <div class="flex items-center justify-between mb-2">
                <h2 class="font-semibold truncate">
                  {{ listTitle(lid) }}
                  <span v-if="!isActiveList(lid)" class="ml-2 text-xs text-sec">(deleted)</span>
                </h2>
              </div>

              <ul class="flex-1 overflow-y-auto overflow-x-hidden scrollbar-left pl-1">
                <li
                  v-for="h in (history[lid] || [])"
                  :key="h.id"
                  class="flex items-center gap-2 px-2 py-1 rounded-lg"
                >
                  <span class="line-through text-muted flex-1 truncate">{{ h.title }}</span>
                  <span class="text-[10px] text-sec">{{ formatTime(h.completedAt) }}</span>
                </li>
              </ul>
            </div>
          </div>
            </section>
          </div>

          <!-- SETTINGS TAB -->
          <div v-else-if="tab==='settings'" class="h-full p-3">
            <h2 class="text-xl font-bold">Settings</h2>
            <p class="text-sec mt-2">Coming soon.</p>
          </div>

          <!-- STATISTICS TAB -->
          <div v-else class="h-full p-3">
            <h2 class="text-xl font-bold">Statistics</h2>
            <p class="text-sec mt-2">Coming soon.</p>
          </div>
        </div>

        <!-- BOTTOM NAV: icons only, active shows label -->
        <nav class="flex justify-around bg-surface p-2">
          <button @click="tab='lists'" class="nav-btn px-2 py-1" :class="tabBtn('lists')" aria-label="Lists">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h12M4 6h.01M8 12h12M4 12h.01M8 18h12M4 18h.01"/></svg>
            <span class="nav-label">Lists</span>
          </button>
          <button @click="tab='stats'" class="nav-btn px-2 py-1" :class="tabBtn('stats')" aria-label="Statistics">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18"/><path d="M7 16l4-4 3 3 5-7"/></svg>
            <span class="nav-label">Statistics</span>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
const STORAGE_KEY = 'df_v1';

function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

export default {
  data() {
    return {
      tab: 'lists', // 'lists' | 'flows' | 'history' | 'settings' | 'stats'
      lists: [],
      flows: [],
      history: {}, // { [listId]: [{id,title,completedAt,fromFlowId,stepIndex}] }
      listTitles: {}, // { [listId]: title } - persists names for deleted lists
      ui: {
        sideOpen: false,
        listAddMenuId: null,
        listAddMenuAbove: false,
        listAddMenuPos: { top: 0, left: 0 },
        selectedFlowId: '',
        addMode: 'task',
        newTaskTitle: '',
        completing: {},
        celebrateTaskId: null,
        // action menus
        listActionsId: null,
        flowActionsId: null,
        stepActionsId: null,
        stepTaskActionsId: null,
        taskActionsId: null,
      }
    };
  },

  computed: {
    // Responsive card widths; when side menu is open, show fewer wider cards
    // phone: ~1 card; md: 3 (or 2 with menu); lg+: 4 (or 3 with menu)
    cardWidth() {
      if (this.ui.sideOpen) {
        return 'w-[92%] md:w-[48%] lg:w-[32%] xl:w-[24%]';
      }
      return 'w-[92%] md:w-[32%] lg:w-[24%]';
    },
    sideClass() {
      // small: fixed drawer width; md+: collapsible width
      return [
        'w-72',
        this.ui.sideOpen ? 'translate-x-0' : '-translate-x-72 md:translate-x-0 md:w-0',
        'fixed md:static left-0 top-0 md:top-auto md:left-auto'
      ].join(' ');
    },
    allListIds() {
      const ids = new Set(Object.keys(this.history || {}));
      (this.lists || []).forEach(l => ids.add(l.id));
      return Array.from(ids);
    },
  },

  created() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const { lists, flows, history, listTitles } = JSON.parse(raw);
      this.lists = lists || [];
      this.flows = flows || [];
      this.history = history || {};
      // reconstruct or use stored titles
      this.listTitles = listTitles || {};
      this.lists.forEach(l => { if (!this.listTitles[l.id]) this.listTitles[l.id] = l.title; });
    } else {
      const f1 = {
        id: uid(),
        title: 'Sample Flow',
        steps: [
          { id: uid(), type: 'single', taskTitle: 'Step 1: Do something' },
          { id: uid(), type: 'single', taskTitle: 'Step 2: Next thing' },
        ],
      };
      this.flows = [f1];
      const initialList = { id: uid(), title: 'My List', tasks: [] };
      this.lists = [initialList];
      this.listTitles[initialList.id] = initialList.title;
      this.history = {};
      this.save();
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.updateListHeights();
      window.addEventListener('resize', this.updateListHeights, { passive: true });
      window.addEventListener('click', this.handleGlobalClick, { passive: true });
    });
  },
  beforeDestroy(){
    window.removeEventListener('resize', this.updateListHeights);
    window.removeEventListener('click', this.handleGlobalClick);
  },

  watch: {
    lists: { deep: true, handler() { this.save(); } },
    flows: { deep: true, handler() { this.save(); } },
    history: { deep: true, handler() { this.save(); } },
    listTitles: { deep: true, handler() { this.save(); } },
  },

  methods: {
    updateListHeights(){
      try {
        const cards = document.querySelectorAll('.list-element, .list-card');
        const dpr = window.devicePixelRatio || 1;
        cards.forEach(card => {
          const root = document.documentElement;
          const rowNom = parseFloat(getComputedStyle(root).getPropertyValue('--row-nominal')) || 40;

          const headerEl = card.querySelector('.list-header');
          const footerEl = card.querySelector('.list-footer') || card.querySelector('.add-footer');
          const listEl = card.querySelector('.list-scroll');
          if (!listEl) return;

          const cardH = card.getBoundingClientRect().height;
          const cs = getComputedStyle(card);
          const padTop = parseFloat(cs.paddingTop) || 0;
          const padBottom = parseFloat(cs.paddingBottom) || 0;
          const headerH = headerEl ? headerEl.getBoundingClientRect().height : 0;
          const headerMB = headerEl ? (parseFloat(getComputedStyle(headerEl).marginBottom) || 0) : 0;
          const footerH = footerEl ? (footerEl.getBoundingClientRect().height || 0) : 0;

          // 1) Set the scroll area height exactly to the remaining space
          const available = Math.max(0, cardH - padTop - padBottom - headerH - headerMB - footerH);
          const listHeightPx = Math.max(0, Math.floor(available * dpr) / dpr);
          listEl.style.height = listHeightPx + 'px';

          // 2) Base row height strictly on the scroll element height (measured)
          const measuredH = listEl.getBoundingClientRect().height || listHeightPx;
          const rows = Math.max(1, Math.floor(measuredH / rowNom));
          let rowFit = rows > 0 ? (measuredH / rows) : measuredH;
          rowFit = Math.max(1, Math.round(rowFit * dpr)) / dpr; // snap to pixel grid
          card.style.setProperty('--row-fit', rowFit + 'px');
        });
      } catch {}
    },
    onListScrollDeferred(e){
      try {
        const el = e.target;
        if (el._snapTimer) clearTimeout(el._snapTimer);
        el._snapTimer = setTimeout(() => {
          try {
            const card = el.closest('.list-element') || el.closest('.list-card');
            if (!card) return;
            const dpr = window.devicePixelRatio || 1;
            const rowFit = parseFloat(getComputedStyle(card).getPropertyValue('--row-fit')) ||
                           parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--row-nominal')) || 40;
            if (!rowFit) return;
            const max = Math.max(0, el.scrollHeight - el.clientHeight);
            const st = Math.min(Math.max(0, el.scrollTop), max);
            const steps = Math.round(st / rowFit);
            let target = steps * rowFit;
            target = Math.round(target * dpr) / dpr;
            if (Math.abs(target - st) > 0.5) {
              el.scrollTo({ top: target, behavior: 'auto' });
            }
          } catch {}
        }, 120);
      } catch {}
    },
    handleGlobalClick(e){
      try {
        const openId = this.ui.listAddMenuId;
        if (!openId) return;
        const menu = document.getElementById('add-menu-'+openId);
        const anchor = document.getElementById('add-anchor-'+openId);
        const t = e.target;
        if (menu && (menu===t || menu.contains(t))) return;
        if (anchor && (anchor===t || anchor.contains(t))) return;
        this.toggleAddMenu(null);
      } catch {}
    },
    save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        lists: this.lists, flows: this.flows, history: this.history, listTitles: this.listTitles,
      }));
    },
    tabBtn(n) { return this.tab===n ? 'active font-semibold' : ''; },
    formatTime(ts) { const d = new Date(ts); return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); },
    toggleSideMd() { this.ui.sideOpen = !this.ui.sideOpen; },
    closeSide() { this.ui.sideOpen = false; },
    openFromSide(name) { this.tab = name; this.closeSide(); },
    isActiveList(id) { return this.lists.some(l => l.id === id); },
    listTitle(id) {
      const live = this.lists.find(l => l.id === id);
      if (live) return live.title;
      return this.listTitles[id] || 'Deleted List';
    },

    /* --- menus --- */
    closeAllMenus() {
      this.ui.listAddMenuId = null; this.ui.selectedFlowId = '';
      this.ui.listActionsId = this.ui.flowActionsId = this.ui.stepActionsId =
        this.ui.stepTaskActionsId = this.ui.taskActionsId = null;
    },
    toggleAddMenu(id){
      const opening = this.ui.listAddMenuId !== id;
      this.ui.listAddMenuId = opening ? id : null;
      if (!opening) return;
      this.ui.addMode = 'task';
      this.ui.newTaskTitle = 'ToDo';
      // default flow selection to first available
      this.ui.selectedFlowId = (this.flows[0] && this.flows[0].id) ? this.flows[0].id : '';
      this.$nextTick(() => this.decideAddMenuPlacement(id));
    },
    decideAddMenuPlacement(listId){
      try {
        const anchor = document.getElementById('add-anchor-'+listId);
        const card = anchor?.closest('.list-card') || anchor?.closest('[class*="rounded-2xl"]');
        if (!anchor || !card) { this.ui.listAddMenuAbove = false; return; }
        const a = anchor.getBoundingClientRect();
        const c = card.getBoundingClientRect();
        const spaceAbove = a.top - c.top;
        const spaceBelow = c.bottom - a.bottom;
        // ensure menu exists to measure
        const menuEl = document.getElementById('add-menu-'+listId);
        const menuH = menuEl?.offsetHeight || 220;
        if (spaceAbove >= menuH) this.ui.listAddMenuAbove = true;
        else if (spaceBelow >= menuH) this.ui.listAddMenuAbove = false;
        else this.ui.listAddMenuAbove = spaceAbove > spaceBelow;

        const gap = 0; // touch the edge
        const top = this.ui.listAddMenuAbove ? (a.top - menuH - gap) : (a.bottom + gap);
        const leftCenter = a.left + (a.width / 2);
        this.ui.listAddMenuPos = { top, left: leftCenter };
      } catch { this.ui.listAddMenuAbove = false; }
    },
    addMenuStyle(listId){
      return {
        position: 'fixed',
        top: this.ui.listAddMenuPos.top + 'px',
        left: this.ui.listAddMenuPos.left + 'px',
        transform: 'translateX(-50%)',
        zIndex: 60,
      };
    },
    toggleListActions(id){ this.ui.listActionsId = this.ui.listActionsId===id ? null : id; },
    toggleFlowActions(id){ this.ui.flowActionsId = this.ui.flowActionsId===id ? null : id; },
    toggleStepActions(id){ this.ui.stepActionsId = this.ui.stepActionsId===id ? null : id; },
    toggleStepTaskActions(id){ this.ui.stepTaskActionsId = this.ui.stepTaskActionsId===id ? null : id; },
    toggleTaskActions(id){ this.ui.taskActionsId = this.ui.taskActionsId===id ? null : id; },

    /* --- lists --- */
    addList() {
      const title = prompt('List title?'); if (!title) return;
      const list = { id: uid(), title: title.trim(), tasks: [] };
      this.lists.push(list);
      this.listTitles[list.id] = list.title;
      this.closeAllMenus();
      this.$nextTick(this.updateListHeights);
    },
    renameList(list) {
      const v = prompt('Rename list', list.title); if (!v) return;
      list.title = v.trim();
      this.listTitles[list.id] = list.title;
      this.closeAllMenus();
    },
    removeList(id) {
      if (!confirm('Delete this list?')) return;
      // keep history and title for deleted lists
      this.lists = this.lists.filter(l=>l.id!==id);
      this.closeAllMenus();
      this.$nextTick(this.updateListHeights);
    },
    promptAddTask(list) {
      const title = prompt('Task title?'); if (!title) return;
      list.tasks.push({ id: uid(), title: title.trim(), fromFlowId: null, stepIndex: null });
      this.toggleAddMenu(null);
    },
    addTaskWithTitle(list){
      const t = (this.ui.newTaskTitle || '').trim();
      if (!t) return;
      list.tasks.push({ id: uid(), title: t, fromFlowId: null, stepIndex: null });
      this.toggleAddMenu(null);
      this.$nextTick(this.updateListHeights);
    },
    setAddMode(mode){
      this.ui.addMode = mode;
      if (mode === 'flow') {
        if (!this.ui.selectedFlowId) {
          const first = this.flows[0];
          if (first) this.ui.selectedFlowId = first.id;
        }
      } else if (mode === 'task') {
        if (!this.ui.newTaskTitle) this.ui.newTaskTitle = 'ToDo';
      }
    },
    onTaskTitleFocus(e){
      if ((this.ui.newTaskTitle || '').trim().toLowerCase() === 'todo') {
        this.ui.newTaskTitle = '';
      }
    },
    onTaskTitleBlur(e){
      if (!(this.ui.newTaskTitle || '').trim()) {
        this.ui.newTaskTitle = 'ToDo';
      }
    },
    editTask(list, t) {
      const v = prompt('Edit task', t.title); if (!v) return;
      t.title = v.trim(); this.closeAllMenus();
    },
    removeTask(list, taskId) {
      list.tasks = list.tasks.filter(t=>t.id!==taskId);
      if (this.ui.taskActionsId===taskId) this.ui.taskActionsId = null;
      this.$nextTick(this.updateListHeights);
    },

    /* --- flows applied to lists (runtime) --- */
    addFlowToList(list, flowId) {
      const f = this.flows.find(x=>x.id===flowId); if (!f) return;
      const first = f.steps[0];
      if (first?.taskTitle?.trim()) {
        list.tasks.push({
          id: uid(), title: first.taskTitle.trim(), fromFlowId: f.id, stepIndex: 0
        });
      }
      this.toggleAddMenu(null);
      this.ui.selectedFlowId = '';
    },

    completeTask(list, task, ev) {
      // animate + play sound, then commit after a short delay
      this.$set ? this.$set(this.ui.completing, task.id, true) : (this.ui.completing[task.id] = true);
      // detect if this is the last step of a flow
      let isFinalFlow = false;
      if (task.fromFlowId != null) {
        const flow = this.flows.find(f=>f.id===task.fromFlowId);
        const nextIdx = (task.stepIndex ?? 0) + 1;
        if (!flow || !flow.steps[nextIdx]?.taskTitle?.trim()) {
          isFinalFlow = true;
        }
      }
      this.playSuccessSound(isFinalFlow);
      setTimeout(() => {
        if (!this.history[list.id]) this.history[list.id] = [];
        this.history[list.id].unshift({
          id: task.id, title: task.title, fromFlowId: task.fromFlowId || null,
          stepIndex: task.stepIndex ?? null, completedAt: Date.now()
        });
        // remove from list
        list.tasks = list.tasks.filter(t=>t.id!==task.id);

        // if came from a flow, consider adding next step
        if (task.fromFlowId != null) {
          const flow = this.flows.find(f=>f.id===task.fromFlowId);
          if (flow) {
            const nextIdx = (task.stepIndex ?? 0) + 1;
            const next = flow.steps[nextIdx];
            if (next?.taskTitle?.trim()) {
              const already = list.tasks.some(t=>t.fromFlowId===flow.id && t.stepIndex===nextIdx && t.title===next.taskTitle.trim());
              if (!already) {
                list.tasks.push({ id: uid(), title: next.taskTitle.trim(), fromFlowId: flow.id, stepIndex: nextIdx });
              }
            }
          }
        }
        delete this.ui.completing[task.id];
      }, 320);
    },
    playSuccessSound(final=false) {
      try {
        const ctx = this.getAudioCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        const makeVoice = (type, freq, start, dur, peak=0.18) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = type; o.frequency.setValueAtTime(freq, start);
          o.connect(g); g.connect(ctx.destination);
          g.gain.setValueAtTime(0.0001, start);
          g.gain.exponentialRampToValueAtTime(peak, start + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
          o.start(start); o.stop(start + dur + 0.02);
        };
        if (!final) {
          // Variant #18: notifySoft — triangle F5, then sine C6
          makeVoice('triangle', 698.46, now,      0.20, 0.12); // F5
          makeVoice('sine',     1046.50, now+0.06, 0.18, 0.08); // C6
        } else {
          // positive triad arpeggio (C-E-G)
          makeVoice('sine', 523.25, now, 0.30, 0.20);        // C5
          makeVoice('triangle', 659.25, now+0.06, 0.30, 0.18); // E5
          makeVoice('sine', 783.99, now+0.12, 0.34, 0.16);     // G5
        }
      } catch (e) { /* ignore */ }
    },
    getAudioCtx() {
      try {
        if (!this._audioCtx) {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) return null;
          this._audioCtx = new AudioCtx();
        }
        if (this._audioCtx.state === 'suspended') {
          this._audioCtx.resume().catch(()=>{});
        }
        return this._audioCtx;
      } catch { return null; }
    },
    triggerTaskCelebration(taskId) {
      this.ui.celebrateTaskId = taskId;
      setTimeout(()=>{ if (this.ui.celebrateTaskId===taskId) this.ui.celebrateTaskId=null; }, 650);
    },
    rayStyle(n) {
      const count = 10;
      const angle = (360 / count) * (n-1);
      const rad = angle * Math.PI / 180;
      const dist = 20 + (n % 4) * 6; // small radius
      const dx = Math.cos(rad) * dist;
      const dy = Math.sin(rad) * dist;
      return { '--dx': dx + 'px', '--dy': dy + 'px', '--rot': angle + 'deg' };
    },

    /* --- flows editor --- */
    addFlow() {
      const title = prompt('Flow title?'); if (!title) return;
      this.flows.push({ id: uid(), title: title.trim(), steps: [] });
    },
    renameFlow(flow) {
      const v = prompt('Rename flow', flow.title); if (!v) return;
      flow.title = v.trim(); this.closeAllMenus();
    },
    removeFlow(id) {
      if (!confirm('Delete this flow?')) return;
      this.flows = this.flows.filter(f=>f.id!==id); this.closeAllMenus();
    },
    addStep(flow) {
      const type = prompt('Step type (only "single" available)', 'single');
      if (!type) return;
      flow.steps.push({ id: uid(), type: type.trim().toLowerCase(), taskTitle: '' });
    },
    deleteStep(flow, stepId) {
      flow.steps = flow.steps.filter(s=>s.id!==stepId); this.closeAllMenus();
    },
    renameStep(step) {
      const v = prompt('Rename step label (optional note)', step.note || ''); // optional note
      if (v===null) return;
      step.note = v.trim(); this.closeAllMenus();
    },
    addStepTask(step) {
      const v = prompt('Task title for this step'); if (!v) return;
      step.taskTitle = v.trim(); this.closeAllMenus();
    },
    renameStepTask(step) {
      const v = prompt('Edit task title', step.taskTitle || ''); if (!v) return;
      step.taskTitle = v.trim(); this.closeAllMenus();
    },
    removeStepTask(step) {
      step.taskTitle = ''; this.closeAllMenus();
    },
  },
};
</script>

<style>
html, body, #app { height: 100%; margin: 0; }
</style>
