<template>
  <div class="flex flex-col h-screen w-screen bg-gray-50">
    <!-- MAIN AREA -->
    <div class="flex-1 overflow-hidden">
      <!-- LISTS TAB -->
      <div v-if="tab==='lists'" class="h-full">
        <header class="px-3 py-2">
          <h1 class="text-xl font-bold">🐉 DragonFlow — Lists</h1>
        </header>

        <section class="h-[calc(100%-2.5rem)]">
          <div class="flex gap-3 h-full overflow-x-auto snap-x snap-mandatory px-3 pb-3">
            <!-- List card -->
            <div
              v-for="list in lists"
              :key="list.id"
              class="relative snap-center shrink-0 bg-white border rounded-2xl shadow-sm p-3 flex flex-col"
              :class="cardWidth"
            >
              <!-- header -->
              <div class="flex items-center justify-between mb-2">
                <h2 class="font-semibold truncate">{{ list.title }}</h2>
                <div class="relative">
                  <button class="px-2 py-1 rounded hover:bg-gray-100" @click="toggleListActions(list.id)">⋮</button>
                  <div
                    v-if="ui.listActionsId===list.id"
                    class="absolute right-0 mt-1 w-36 bg-white border rounded-xl shadow"
                  >
                    <button class="w-full text-left px-3 py-2 hover:bg-gray-100" @click="renameList(list)">Edit</button>
                    <button class="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50" @click="removeList(list.id)">Delete</button>
                  </div>
                </div>
              </div>

              <!-- tasks (active only) -->
              <ul class="flex-1 overflow-y-auto pr-1">
                <li
                  v-for="t in list.tasks"
                  :key="t.id"
                  class="group flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100"
                >
                  <input type="checkbox" :checked="false" @change="completeTask(list, t)" />
                  <button class="flex-1 text-left leading-tight truncate" @click="toggleTaskActions(t.id)">
                    {{ t.title }} <span v-if="t.fromFlowId" class="ml-1 text-[10px] text-purple-600">(flow)</span>
                  </button>

                  <!-- actions menu -->
                  <div class="relative">
                    <button class="px-2 py-1 rounded hover:bg-gray-100" @click="toggleTaskActions(t.id)">⋮</button>
                    <div
                      v-if="ui.taskActionsId===t.id"
                      class="absolute right-0 mt-1 w-36 bg-white border rounded-xl shadow"
                    >
                      <button class="w-full text-left px-3 py-2 hover:bg-gray-100" @click="editTask(list, t)">Edit</button>
                      <button class="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50" @click="removeTask(list, t.id)">Delete</button>
                    </div>
                  </div>
                </li>
              </ul>

              <!-- add menu -->
              <div class="absolute bottom-3 right-3">
                <div class="relative">
                  <button class="h-10 w-10 rounded-full bg-purple-600 text-white text-2xl leading-none" @click="toggleAddMenu(list.id)">+</button>

                  <div
                    v-if="ui.listAddMenuId===list.id"
                    class="absolute bottom-12 right-0 w-60 bg-white border rounded-xl shadow-lg p-2 space-y-2"
                  >
                    <button class="w-full text-left px-2 py-2 rounded hover:bg-gray-100" @click="promptAddTask(list)">
                      + Task
                    </button>

                    <div class="border-t my-1"></div>

                    <div>
                      <label class="block text-xs text-gray-500 px-2 mb-1">Add Flow</label>
                      <select v-model="ui.selectedFlowId" class="w-full border rounded px-2 py-1">
                        <option disabled value="">Choose a flow…</option>
                        <option v-for="f in flows" :key="f.id" :value="f.id">{{ f.title }}</option>
                      </select>
                      <div class="mt-2 flex gap-2">
                        <button class="flex-1 px-2 py-1 rounded bg-purple-600 text-white disabled:opacity-50"
                          :disabled="!ui.selectedFlowId"
                          @click="addFlowToList(list, ui.selectedFlowId)"
                        >
                          Add
                        </button>
                        <button class="px-2 py-1 rounded border" @click="toggleAddMenu(null)">Close</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- add new list -->
            <button
              class="snap-center shrink-0 border-2 border-dashed rounded-2xl text-gray-500 hover:text-purple-600 hover:border-purple-400 grid place-content-center"
              :class="cardWidth"
              @click="addList"
              title="Add list"
            >
              <div class="text-4xl">+</div>
              <div class="text-sm">New List</div>
            </button>
          </div>
        </section>
      </div>

      <!-- FLOWS TAB -->
      <div v-else-if="tab==='flows'" class="h-full">
        <header class="px-3 py-2"><h1 class="text-xl font-bold">🔁 Flows</h1></header>

        <section class="h-[calc(100%-2.5rem)]">
          <div class="flex gap-3 h-full overflow-x-auto snap-x snap-mandatory px-3 pb-3">
            <div
              v-for="flow in flows"
              :key="flow.id"
              class="relative snap-center shrink-0 bg-white border rounded-2xl shadow-sm p-3 flex flex-col"
              :class="cardWidth"
            >
              <!-- flow header -->
              <div class="flex items-center justify-between mb-2">
                <h2 class="font-semibold truncate">{{ flow.title }}</h2>
                <div class="relative">
                  <button class="px-2 py-1 rounded hover:bg-gray-100" @click="toggleFlowActions(flow.id)">⋮</button>
                  <div v-if="ui.flowActionsId===flow.id" class="absolute right-0 mt-1 w-36 bg-white border rounded-xl shadow">
                    <button class="w-full text-left px-3 py-2 hover:bg-gray-100" @click="renameFlow(flow)">Edit</button>
                    <button class="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50" @click="removeFlow(flow.id)">Delete</button>
                  </div>
                </div>
              </div>

              <!-- steps -->
              <div class="flex-1 overflow-y-auto pr-1 space-y-3">
                <div v-for="(step, idx) in flow.steps" :key="step.id" class="border rounded-lg p-2">
                  <div class="flex items-center justify-between mb-2">
                    <div class="text-xs text-gray-500">Step {{ idx+1 }} — type: single</div>
                    <div class="relative">
                      <button class="px-2 py-1 rounded hover:bg-gray-100" @click="toggleStepActions(step.id)">⋮</button>
                      <div v-if="ui.stepActionsId===step.id" class="absolute right-0 mt-1 w-36 bg-white border rounded-xl shadow">
                        <button class="w-full text-left px-3 py-2 hover:bg-gray-100" @click="renameStep(step)">Edit</button>
                        <button class="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50" @click="deleteStep(flow, step.id)">Delete</button>
                      </div>
                    </div>
                  </div>

                  <!-- single-task area -->
                  <div v-if="!step.taskTitle" class="flex justify-end">
                    <button class="px-2 py-1 rounded bg-purple-600 text-white" @click="addStepTask(step)">
                      + Add task
                    </button>
                  </div>
                  <div v-else class="flex items-center gap-2">
                    <span class="flex-1 px-2 py-1 border rounded">{{ step.taskTitle }}</span>
                    <!-- task actions in step -->
                    <div class="relative">
                      <button class="px-2 py-1 rounded hover:bg-gray-100" @click="toggleStepTaskActions(step.id)">⋮</button>
                      <div v-if="ui.stepTaskActionsId===step.id" class="absolute right-0 mt-1 w-36 bg-white border rounded-xl shadow">
                        <button class="w-full text-left px-3 py-2 hover:bg-gray-100" @click="renameStepTask(step)">Edit</button>
                        <button class="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50" @click="removeStepTask(step)">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- add step -->
              <div class="absolute bottom-3 right-3">
                <button class="h-10 w-10 rounded-full bg-purple-600 text-white text-2xl leading-none" @click="addStep(flow)">+</button>
              </div>
            </div>

            <!-- add new flow -->
            <button
              class="snap-center shrink-0 border-2 border-dashed rounded-2xl text-gray-500 hover:text-purple-600 hover:border-purple-400 grid place-content-center"
              :class="cardWidth"
              @click="addFlow"
            >
              <div class="text-4xl">+</div>
              <div class="text-sm">New Flow</div>
            </button>
          </div>
        </section>
      </div>

      <!-- HISTORY TAB -->
      <div v-else-if="tab==='history'" class="h-full">
        <header class="px-3 py-2"><h1 class="text-xl font-bold">🕘 History</h1></header>
        <section class="h-[calc(100%-2.5rem)]">
          <div class="flex gap-3 h-full overflow-x-auto snap-x snap-mandatory px-3 pb-3">
            <div
              v-for="list in lists"
              :key="list.id + '-history'"
              class="relative snap-center shrink-0 bg-white border rounded-2xl shadow-sm p-3 flex flex-col"
              :class="cardWidth"
            >
              <div class="flex items-center justify-between mb-2">
                <h2 class="font-semibold truncate">{{ list.title }}</h2>
              </div>

              <ul class="flex-1 overflow-y-auto pr-1">
                <li
                  v-for="h in (history[list.id] || [])"
                  :key="h.id"
                  class="flex items-center gap-2 px-2 py-1 rounded-lg"
                >
                  <span class="line-through text-gray-400 flex-1 truncate">{{ h.title }}</span>
                  <span class="text-[10px] text-gray-400">{{ formatTime(h.completedAt) }}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <!-- SETTINGS TAB -->
      <div v-else class="h-full p-3">
        <h1 class="text-xl font-bold">⚙️ Settings</h1>
        <p class="text-gray-500 mt-2">Coming soon.</p>
      </div>
    </div>

    <!-- NAV -->
    <nav class="flex justify-around border-t bg-white p-2">
      <button @click="tab='lists'" :class="tabBtn('lists')">Lists</button>
      <button @click="tab='flows'" :class="tabBtn('flows')">Flows</button>
      <button @click="tab='history'" :class="tabBtn('history')">History</button>
      <button @click="tab='settings'" :class="tabBtn('settings')">Settings</button>
    </nav>
  </div>
</template>

<script>
const STORAGE_KEY = 'df_v1';

function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

export default {
  data() {
    return {
      tab: 'lists',
      lists: [],
      flows: [],
      history: {}, // { [listId]: [{id,title,completedAt,fromFlowId,stepIndex}] }
      ui: {
        listAddMenuId: null,
        selectedFlowId: '',
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
    // phone: ~1 card; md: 3; lg: 4
    cardWidth() { return 'w-[92%] md:w-[32%] lg:w-[24%]'; },
  },

  created() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const { lists, flows, history } = JSON.parse(raw);
      this.lists = lists || [];
      this.flows = flows || [];
      this.history = history || {};
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
      this.lists = [{ id: uid(), title: 'My List', tasks: [] }];
      this.history = {};
      this.save();
    }
  },

  watch: {
    lists: { deep: true, handler() { this.save(); } },
    flows: { deep: true, handler() { this.save(); } },
    history: { deep: true, handler() { this.save(); } },
  },

  methods: {
    save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        lists: this.lists, flows: this.flows, history: this.history,
      }));
    },
    tabBtn(n) { return this.tab===n ? 'font-bold text-purple-600' : 'text-gray-500'; },
    formatTime(ts) { const d = new Date(ts); return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); },

    /* --- menus --- */
    closeAllMenus() {
      this.ui.listAddMenuId = null; this.ui.selectedFlowId = '';
      this.ui.listActionsId = this.ui.flowActionsId = this.ui.stepActionsId =
        this.ui.stepTaskActionsId = this.ui.taskActionsId = null;
    },
    toggleAddMenu(id){ this.ui.listAddMenuId = this.ui.listAddMenuId===id ? null : id; this.ui.selectedFlowId=''; },
    toggleListActions(id){ this.ui.listActionsId = this.ui.listActionsId===id ? null : id; },
    toggleFlowActions(id){ this.ui.flowActionsId = this.ui.flowActionsId===id ? null : id; },
    toggleStepActions(id){ this.ui.stepActionsId = this.ui.stepActionsId===id ? null : id; },
    toggleStepTaskActions(id){ this.ui.stepTaskActionsId = this.ui.stepTaskActionsId===id ? null : id; },
    toggleTaskActions(id){ this.ui.taskActionsId = this.ui.taskActionsId===id ? null : id; },

    /* --- lists --- */
    addList() {
      const title = prompt('List title?'); if (!title) return;
      this.lists.push({ id: uid(), title: title.trim(), tasks: [] });
      this.closeAllMenus();
    },
    renameList(list) {
      const v = prompt('Rename list', list.title); if (!v) return;
      list.title = v.trim(); this.closeAllMenus();
    },
    removeList(id) {
      if (!confirm('Delete this list?')) return;
      this.lists = this.lists.filter(l=>l.id!==id);
      delete this.history[id];
      this.closeAllMenus();
    },
    promptAddTask(list) {
      const title = prompt('Task title?'); if (!title) return;
      list.tasks.push({ id: uid(), title: title.trim(), fromFlowId: null, stepIndex: null });
      this.toggleAddMenu(null);
    },
    editTask(list, t) {
      const v = prompt('Edit task', t.title); if (!v) return;
      t.title = v.trim(); this.closeAllMenus();
    },
    removeTask(list, taskId) {
      list.tasks = list.tasks.filter(t=>t.id!==taskId);
      if (this.ui.taskActionsId===taskId) this.ui.taskActionsId = null;
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

    completeTask(list, task) {
      // move to history and remove from active list
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
        if (!flow) return;
        const nextIdx = (task.stepIndex ?? 0) + 1;
        const next = flow.steps[nextIdx];
        if (next?.taskTitle?.trim()) {
          const already = list.tasks.some(t=>t.fromFlowId===flow.id && t.stepIndex===nextIdx && t.title===next.taskTitle.trim());
          if (!already) {
            list.tasks.push({
              id: uid(), title: next.taskTitle.trim(), fromFlowId: flow.id, stepIndex: nextIdx
            });
          }
        }
      }
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
      flow.steps.push({ id: uid(), type: 'single', taskTitle: '' });
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
::-webkit-scrollbar { height: 8px; width: 8px; }
::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 9999px; }
</style>
