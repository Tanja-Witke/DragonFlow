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
            <button class="btn-ghost no-hover md:hidden" @click.stop="closeSide" aria-label="Close menu">
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
        <div class="flex items-center justify-between px-3 py-2 bg-surface topbar">
          <div class="flex items-center gap-2">
            <button class="btn-ghost no-hover md:hidden" @click.stop="ui.sideOpen = true" aria-label="Open menu">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
            </button>
            <!-- Desktop side toggle on the left -->
            <button class="btn-ghost no-hover hidden md:inline-flex" @click.stop="toggleSideMd" title="Toggle menu" aria-label="Toggle side menu">
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
            <!-- View switchers next to title -->
            <div v-if="tab==='lists'" id="anchor-listview" class="relative">
              <button class="btn-ghost" @click.stop="openListViewEditMenu($event)" title="Switch view" aria-label="Switch list view">
                <span v-if="!ui.listViewNameEditing">{{ listViewName }}</span>
                <input v-else ref="listViewNameInput" class="inline-edit" v-model.trim="ui.listViewEditName" @click.stop @keydown.enter.stop.prevent="saveListViewName" @keydown.esc.stop.prevent="cancelListViewName" @blur="saveListViewName" />
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
              </button>
              <div v-if="ui.listViewMenuOpen" id="menu-listview" class="menu-pop left" :class="ui.menuDir['listview'] === 'up' ? 'up' : 'down'">
                <button v-for="v in listViews.filter(v=>v.id!==currentListViewId)" :key="v.id" class="menu-item" @click.stop="switchListView(v.id)">{{ v.name }}</button>
                <button class="menu-item" @click.stop="addListView">+ New View</button>
              </div>
            </div>
            <div v-else-if="tab==='flows'" id="anchor-flowview" class="relative">
              <button class="btn-ghost" @click.stop="openFlowViewEditMenu($event)" title="Switch view" aria-label="Switch flow view">
                <span v-if="!ui.flowViewNameEditing">{{ flowViewName }}</span>
                <input v-else ref="flowViewNameInput" class="inline-edit" v-model.trim="ui.flowViewEditName" @click.stop @keydown.enter.stop.prevent="saveFlowViewName" @keydown.esc.stop.prevent="cancelFlowViewName" @blur="saveFlowViewName" />
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
              </button>
              <div v-if="ui.flowViewMenuOpen" id="menu-flowview" class="menu-pop left" :class="ui.menuDir['flowview'] === 'up' ? 'up' : 'down'">
                <button v-for="v in flowViews.filter(v=>v.id!==currentFlowViewId)" :key="v.id" class="menu-item" @click.stop="switchFlowView(v.id)">{{ v.name }}</button>
                <button class="menu-item" @click.stop="addFlowView">+ New View</button>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <button class="btn-ghost" :class="{ 'opacity-50 pointer-events-none': !canUndo }" :disabled="!canUndo" @click="undo" title="Undo (Ctrl/Cmd+Z)" aria-label="Undo">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 6H4v5"/>
                <path d="M20 18a8 8 0 0 0-8-8H6"/>
              </svg>
            </button>
            <button class="btn-ghost" :class="{ 'opacity-50 pointer-events-none': !canRedo }" :disabled="!canRedo" @click="redo" title="Redo (Ctrl+Y or Shift+Ctrl/Cmd+Z)" aria-label="Redo">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 6h5v5"/>
                <path d="M4 18a8 8 0 0 1 8-8h4"/>
              </svg>
            </button>
            <div class="relative" id="anchor-currentview">
              <button class="btn-ghost no-hover" @click.stop="toggleCurrentViewMenu($event)" aria-label="Current view actions">
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
              </button>
              <div v-if="ui.currentViewMenuOpen" id="menu-currentview" class="menu-pop right" :class="ui.menuDir['currentview'] === 'up' ? 'up' : 'down'">
                <template v-if="(listViewName||'').toLowerCase()==='home'">
                  <div class="menu-item text-muted cursor-default">Home view cannot be deleted</div>
                </template>
                <template v-else>
                  <button v-if="!ui.currentViewDeleteConfirm" class="menu-item danger" @click.stop="openViewDeleteConfirm">Delete View</button>
                  <div v-else class="space-y-2 px-2 pb-2">
                    <div class="text-xs text-sec">Delete "{{ listViewName }}"?</div>
                    <div class="flex justify-end gap-2">
                      <button class="btn-outline text-xs" @click.stop="ui.currentViewDeleteConfirm=false">Cancel</button>
                      <button class="btn-primary text-xs danger" ref="viewDeleteConfirmBtn" @click.stop="deleteCurrentView">Delete</button>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- CONTENT AREA -->
        <div class="flex-1 overflow-hidden">
          <!-- LISTS TAB -->
          <div v-if="tab==='lists'" class="h-full">
            <section class="h-full">
              <div class="flex gap-3 h-full overflow-x-auto snap-x snap-mandatory px-3 pb-3 pt-3">
                <!-- List card -->
                <div
                  v-for="(list, idx) in listsForCurrentView"
                  :key="list.id"
                  class="relative snap-center shrink-0 surface rounded-2xl shadow p-3 flex flex-col list-card list-element"
                  :class="[cardWidth, ui.draggingListId===list.id ? 'opacity-75' : '']"
                  draggable="true"
                  @dragstart="startListDrag(list, idx, $event)"
                  @dragover.prevent="onListDragOverCard(list, idx, $event)"
                  @drop.prevent="onListDrop(list, idx, $event)"
                  @dragend="endListDrag"
                >
              <!-- header (ellipsis opens actions) -->
                <div class="list-header flex items-center justify-between mb-2" :id="'anchor-list-'+list.id">
                  <h2 class="font-semibold truncate ml-2 md:ml-3">
                    <span v-if="ui.inlineEditKey !== ('list-' + list.id)" class="cursor-text" @click.stop="startInlineEditList(list, $event)">{{ list.title }}</span>
                    <input v-else :id="'edit-input-list-'+list.id" class="inline-edit" v-model.trim="ui.inlineEditValue" @click.stop @keydown.enter.stop.prevent="saveInlineEdit" @keydown.esc.stop.prevent="cancelInlineEdit" @blur="saveInlineEdit" />
                  </h2>
                  <div class="relative">
                    <button class="btn-ghost no-hover" @click.stop="toggleListActions(list.id, $event)" aria-label="List actions">
                      <svg class="icon" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                    </button>
                    <div
                      v-if="ui.listActionsId===list.id"
                      :id="'menu-list-'+list.id"
                      class="menu-pop right"
                      :class="ui.menuDir['list-'+list.id] === 'up' ? 'up' : 'down'"
                    >
                      <div v-if="ui.listDeleteConfirmId===list.id" class="space-y-2 px-2 pb-2">
                        <div class="text-xs text-sec">Delete "{{ list.title }}"?</div>
                        <div class="flex justify-end gap-2">
                          <button class="btn-outline text-xs" @click.stop="cancelDeleteList">Cancel</button>
                          <button
                            class="btn-primary text-xs danger"
                            :ref="'listDeleteConfirmBtn-'+list.id"
                            @click.stop="confirmDeleteList(list.id)"
                          >Delete</button>
                        </div>
                      </div>
                      <button v-else class="menu-item danger" @click.stop="askDeleteList(list.id)">Delete</button>
                    </div>
                  </div>
                </div>

              <!-- tasks area container (fills available height) -->
              <div class="task-area overflow-hidden">
              <!-- tasks (active only) -->
              <ul
                class="h-full overflow-y-auto overflow-x-hidden scrollbar-left pl-1 vlist list-scroll"
                @scroll="onListScrollDeferred($event)"
                @dragover.prevent="onListDragOver(list, $event)"
                @drop="onListDrop(list, $event)"
              >
                <li
                  v-for="(t, ti) in list.tasks"
                  :key="t.id"
                  :id="'anchor-task-'+t.id"
                  class="group relative flex items-center gap-2 px-2 py-1 task-item snap-start cursor-pointer"
                  :class="[ t.fromFlowId ? 'flow-task' : '', ui.completing[t.id] ? 'completing' : '', taskDnDClass(list, t, ti) ]"
                  draggable="true"
                  @click.stop="onTaskRowClick(list, t, $event)"
                  @dragstart="onTaskDragStart(list, t, ti, $event)"
                  @dragend="onTaskDragEnd($event)"
                  @dragover.prevent.stop="onTaskDragOver(list, t, ti, $event)"
                  @drop.stop="onTaskDropOnItem(list, t, ti, $event)"
                >
                  

                  <!-- title in the middle -->
                        <span v-if="ui.inlineEditKey !== ('task-' + list.id + '-' + t.id)" class="flex-1 order-2 text-left leading-tight truncate cursor-text" @click.stop="startInlineEditTask(list, t, $event)">{{ t.title }}</span>
                        <input v-else :id="'edit-input-task-'+list.id+'-'+t.id" class="flex-1 order-2 text-left leading-tight truncate bg-transparent border border-div rounded px-2 py-1" v-model.trim="ui.inlineEditValue" @click.stop @keydown.enter.stop.prevent="saveInlineEdit" @keydown.esc.stop.prevent="cancelInlineEdit" @blur="saveInlineEdit" />

                  <!-- checkbox on the right -->
                  <input class="order-3" type="checkbox" :checked="false" :disabled="ui.completing[t.id]" @click.stop @change="completeTask(list, t, $event)" />

                  <!-- task row actions menu (opens on row click) -->
                  <div v-if="ui.taskActionsId===t.id" :id="'menu-task-'+t.id" class="menu-pop left" :class="ui.menuDir['task-'+t.id] === 'up' ? 'up' : 'down'">
                    <template v-if="ui.menuDir['task-'+t.id] === 'up'">
                      <button class="menu-item danger" @click="removeTask(list, t.id)">Delete</button>
                      
                    </template>
                    <template v-else>
                      
                      <button class="menu-item danger" @click="removeTask(list, t.id)">Delete</button>
                    </template>
                  </div>

                <!-- celebration overlay at task level -->
                <div v-if="ui.celebrateTaskId===t.id" class="celebrate-overlay">
                  <span v-for="n in 10" :key="'ray-'+t.id+'-'+n" class="ray" :style="rayStyle(n)"></span>
                </div>
                </li>
              </ul>
              </div>

              <!-- list footer: pinned to bottom of list element, always visible -->
              <div :id="'add-anchor-'+list.id" class="add-footer list-footer group px-2" @click="toggleAddMenu(list.id)">
                <div class="new-btn">
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

                  <div v-if="ui.addMode==='task'" class="space-y-2">
                    <label class="block text-xs text-sec px-2">Task Title</label>
                    <input
                      v-model.trim="ui.newTaskTitle"
                      :class="['field', ((ui.newTaskTitle||'').trim()===ui.placeholderSample) ? 'placeholder-active' : '']"
                      @focus="onTaskTitleFocus"
                      @blur="onTaskTitleBlur"
                    />
                    <div class="flex items-center justify-between gap-2 px-1">
                      <div class="flex gap-2">
                        <button class="btn-outline" :class="ui.addMode==='task' ? 'is-active' : ''" @click.stop="setAddMode('task')">Task</button>
                        <button class="btn-outline" :class="ui.addMode==='flow' ? 'is-active' : ''" @click.stop="setAddMode('flow')">Flow</button>
                      </div>
                      <div class="flex gap-2">
                        <button class="btn-primary" :disabled="!ui.newTaskTitle" @click.stop="addTaskWithTitle(list)">Add Task</button>
                      </div>
                    </div>
                  </div>

                  <div v-else class="space-y-2">
                    <label class="block text-xs text-sec px-2">Choose Flow</label>
                    <select v-model="ui.selectedFlowId" class="field">
                      <option disabled value="">Choose a flow…</option>
                      <option v-for="f in flows" :key="f.id" :value="f.id">{{ f.title }}</option>
                    </select>
                    <div class="flex items-center justify-between gap-2 px-1">
                      <div class="flex gap-2">
                        <button class="btn-outline" :class="ui.addMode==='task' ? 'is-active' : ''" @click.stop="setAddMode('task')">Task</button>
                        <button class="btn-outline" :class="ui.addMode==='flow' ? 'is-active' : ''" @click.stop="setAddMode('flow')">Flow</button>
                      </div>
                      <div class="flex gap-2">
                        <button class="btn-primary" :disabled="!ui.selectedFlowId" @click.stop="addFlowToList(list, ui.selectedFlowId)">Add Flow</button>
                      </div>
                    </div>
              </div>
            </div>
              </div>
            </div>

            <!-- add new list (full card size, subtle) -->
            <div
              id="anchor-newlist"
              class="relative snap-center shrink-0"
              :class="cardWidth"
            >
              <button
                class="w-full h-full muted-tile rounded-2xl shadow p-3 flex flex-col"
                @click="toggleNewListMenu($event)"
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
          </div>
            </section>
          <teleport to="body">
            <div v-if="ui.newListMenuOpen" class="add-list-layer">
              <div
                id="menu-newlist"
                class="menu-pop add-list-floating space-y-3"
                :style="newListMenuStyle()"
                @click.stop
              >
                <input
                  ref="newListInput"
                  v-model.trim="ui.newListTitle"
                  class="field w-full"
                  placeholder="e.g., Work"
                  @keydown.enter.stop.prevent="createListFromInput"
                />
                <div class="flex justify-end gap-2">
                  <button class="btn-outline text-sm" @click.stop="closeNewListMenu">Cancel</button>
                  <button class="btn-primary text-sm" :disabled="!ui.newListTitle.trim()" @click.stop="createListFromInput">Create</button>
                </div>
              </div>
            </div>
          </teleport>
          </div>
          <!-- FLOWS TAB -->
          <div v-else-if="tab==='flows'" class="h-full">
            <section class="h-full">
              <div class="flex gap-3 h-full overflow-x-auto snap-x snap-mandatory px-3 pb-3 pt-3">
                <div
                  v-for="flow in flowsForCurrentView"
                  :key="flow.id"
                  class="relative snap-center shrink-0 surface rounded-2xl shadow p-3 flex flex-col"
                  :class="cardWidth"
                >
                  <!-- flow header -->
                  <div class="flex items-center justify-between mb-2" :id="'anchor-flow-'+flow.id">
                    <h2 class="font-semibold truncate">
                      <span v-if="ui.inlineEditKey !== ('flow-' + flow.id)" class="cursor-text" @click.stop="startInlineEditFlow(flow, $event)">{{ flow.title }}</span>
                      <input v-else :id="'edit-input-flow-'+flow.id" class="inline-edit" v-model.trim="ui.inlineEditValue" @click.stop @keydown.enter.stop.prevent="saveInlineEdit" @keydown.esc.stop.prevent="cancelInlineEdit" @blur="saveInlineEdit" />
                    </h2>
                    <div class="relative">
                      <button class="btn-ghost no-hover" @click.stop="toggleFlowActions(flow.id, $event)" aria-label="Flow actions">
                        <svg class="icon" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                      </button>
                      <div v-if="ui.flowActionsId===flow.id" :id="'menu-flow-'+flow.id" class="menu-pop left" :class="ui.menuDir['flow-'+flow.id] === 'up' ? 'up' : 'down'">
                        <template v-if="ui.menuDir['flow-'+flow.id] === 'up'">
                          <button class="menu-item danger" @click="removeFlow(flow.id)">Delete</button>
                          
                        </template>
                        <template v-else>
                          
                          <button class="menu-item danger" @click="removeFlow(flow.id)">Delete</button>
                        </template>
                      </div>
                    </div>
                  </div>

                  <!-- steps -->
                  <div class="flex-1 overflow-y-auto overflow-x-hidden scrollbar-left pl-1 space-y-3">
                    <div v-for="(step, idx) in flow.steps" :key="step.id" class="elev rounded-lg p-2 transition">
                      <div class="flex items-center justify-between mb-2">
                        <div class="text-xs text-sec">Step {{ idx+1 }} — type: single</div>
                        <div class="relative" :id="'anchor-steptask-'+step.id">
                          <button class="btn-ghost no-hover" @click.stop="toggleStepActions(step.id, $event)" aria-label="Step actions">
                            <svg class="icon" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                          </button>
                          <div v-if="ui.stepActionsId===step.id" :id="'menu-step-'+step.id" class="menu-pop left" :class="ui.menuDir['step-'+step.id] === 'up' ? 'up' : 'down'">
                            <template v-if="ui.menuDir['step-'+step.id] === 'up'">
                              <button class="menu-item danger" @click="deleteStep(flow, step.id)">Delete</button>
                              
                            </template>
                            <template v-else>
                              
                              <button class="menu-item danger" @click="deleteStep(flow, step.id)">Delete</button>
                            </template>
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
                        <span v-if="ui.inlineEditKey !== ('steptask-' + flow.id + '-' + step.id)" class="flex-1 px-2 py-1 border border-div rounded cursor-text" @click.stop="startInlineEditStepTask(flow, step, $event)">{{ step.taskTitle }}</span>
                        <input v-else :id="'edit-input-steptask-'+flow.id+'-'+step.id" class="flex-1 px-2 py-1 border border-div rounded bg-transparent" v-model.trim="ui.inlineEditValue" @click.stop @keydown.enter.stop.prevent="saveInlineEdit" @keydown.esc.stop.prevent="cancelInlineEdit" @blur="saveInlineEdit" />
                        <!-- task actions in step -->
                        <div class="relative">
                          <button class="btn-ghost no-hover" @click.stop="toggleStepTaskActions(step.id, $event)" aria-label="Step task actions">
                            <svg class="icon" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                          </button>
                          <div v-if="ui.stepTaskActionsId===step.id" :id="'menu-steptask-'+step.id" class="menu-pop left" :class="ui.menuDir['steptask-'+step.id] === 'up' ? 'up' : 'down'">
                            <template v-if="ui.menuDir['steptask-'+step.id] === 'up'">
                              <button class="menu-item danger" @click="removeStepTask(step)">Delete</button>
                              
                            </template>
                            <template v-else>
                              
                              <button class="menu-item danger" @click="removeStepTask(step)">Delete</button>
                            </template>
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
                  class="relative snap-center shrink-0 surface rounded-2xl shadow p-3 flex flex-col h-full"
                  :class="cardWidth"
                >
                  <div class="flex items-center justify-between mb-2">
                <h2 class="font-semibold truncate">
                  {{ listTitle(lid) }}
                  <span v-if="!isActiveList(lid)" class="ml-2 text-xs text-sec">(deleted)</span>
                </h2>
              </div>

              <ul class="h-full overflow-y-auto overflow-x-hidden scrollbar-left pl-1 vlist list-scroll">
                <li
                  v-for="h in (history[lid] || [])"
                  :key="h.id + '-' + (h.completedAt||0) + '-hist'"
                  class="group relative flex items-center gap-2 px-2 py-1 task-item snap-start cursor-pointer"
                  @click.stop="openHistoryMenu(lid, h, $event)"
                >
                  <span
                    :class="[
                      ((h.action||'completed')==='completed') ? 'line-through text-muted' : 'text-danger italic',
                      'flex-1 text-left leading-tight truncate'
                    ]"
                  >{{ h.title }}</span>
                  <span class="text-[10px] text-sec">{{ formatTime(h.completedAt) }}</span>
                  <div
                    v-if="ui.historyActionsKey === (lid + '-' + h.id + '-' + (h.completedAt||0))"
                    :id="'menu-history-' + lid + '-' + h.id + '-' + (h.completedAt||0)"
                    class="menu-pop right"
                    :class="ui.menuDir['history-' + lid + '-' + h.id + '-' + (h.completedAt||0)] === 'up' ? 'up' : 'down'"
                  >
                    <button v-if="canRestoreHistory(h)" class="menu-item" @click.stop="restoreHistoryItem(lid, h)">Restore</button>
                  </div>
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
      // Views for lists and flows
      listViews: [], // [{id,name,listIds:[] }]
      flowViews: [], // [{id,name,flowIds:[] }]
      currentListViewId: '',
      currentFlowViewId: '',
      history: {}, // { [listId]: [{id,title,completedAt,fromFlowId,stepIndex,action?: 'completed'|'deleted'}] }
      listTitles: {}, // { [listId]: title } - persists names for deleted lists
      ui: {
        sideOpen: false,
        listAddMenuId: null,
        listAddMenuAbove: false,
        listAddMenuPos: { top: 0, left: 0 },
        newListMenuOpen: false,
        newListTitle: '',
        newListMenuPos: { top: 0, left: 0 },
        selectedFlowId: '',
        addMode: 'task',
        newTaskTitle: '',
        placeholderSample: '',
        completing: {},
        celebrateTaskId: null,
        // action menus
        listActionsId: null,
        flowActionsId: null,
        stepActionsId: null,
        stepTaskActionsId: null,
        taskActionsId: null,
        menuDir: {},
        historyActionsKey: null,
        // history stacks
        undoStack: [],
        redoStack: [],
        // view menus
        listViewMenuOpen: false,
        flowViewMenuOpen: false,
        currentViewMenuOpen: false,
        currentViewDeleteConfirm: false,
        listViewEditName: '',
        flowViewEditName: '',
        listViewNameEditing: false,
        flowViewNameEditing: false,
        inlineEditKey: null,
        inlineEditValue: '',
        draggingListId: null,
        draggingListIndex: -1,
        listDeleteConfirmId: null,
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
    listViewName() { return (this.listViews.find(v=>v.id===this.currentListViewId)?.name) || 'Home'; },
    flowViewName() { return (this.flowViews.find(v=>v.id===this.currentFlowViewId)?.name) || 'Home'; },
    listsForCurrentView() {
      const view = this.listViews.find(x=>x.id===this.currentListViewId);
      const homeId = this.homeListViewId();
      if (!view || view.id === homeId) return this.lists;
      return (this.lists||[]).filter(l => (l.viewId || homeId) === view.id);
    },
    flowsForCurrentView() {
      const v = this.flowViews.find(x=>x.id===this.currentFlowViewId);
      if (!v) return this.flows;
      const set = new Set(v.flowIds||[]);
      return this.flows.filter(f=>set.has(f.id));
    },
    canUndo() { return (this.ui.undoStack?.length || 0) > 0; },
    canRedo() { return (this.ui.redoStack?.length || 0) > 0; },
  },

  created() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const { lists, flows, history, listTitles, listViews, flowViews, currentListViewId, currentFlowViewId } = JSON.parse(raw);
      this.lists = lists || [];
      this.flows = flows || [];
      this.history = history || {};
      // reconstruct or use stored titles
      this.listTitles = listTitles || {};
      this.lists.forEach(l => { if (!this.listTitles[l.id]) this.listTitles[l.id] = l.title; });
      this.listViews = Array.isArray(listViews) ? listViews : [];
      this.flowViews = Array.isArray(flowViews) ? flowViews : [];
      this.currentListViewId = currentListViewId || '';
      this.currentFlowViewId = currentFlowViewId || '';
      this.ensureDefaultViews();
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
      this.ensureDefaultViews();
      this.save();
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.updateListHeights();
      window.addEventListener('resize', this.updateListHeights, { passive: true });
      window.addEventListener('click', this.handleGlobalClick, { passive: true });
      this.updateAccentFromBackground();
      // Recalculate accent when viewport or background changes (more targeted to avoid flicker)
      const deb = (fn)=>{ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),180); }; };
      this._accentDebounced = deb(this.updateAccentFromBackground);
      window.addEventListener('orientationchange', this._accentDebounced, { passive: true });
      const appBg = document.querySelector('.app-bg');
      if (appBg && window.MutationObserver) {
        this._accentObserver = new MutationObserver(this._accentDebounced);
        this._accentObserver.observe(appBg, { attributes: true, attributeFilter: ['style'] });
      }
      // Lightweight polling as a fallback only every 5s
      try {
        this._accentPrevImage = getComputedStyle(appBg||document.body).backgroundImage;
        this._accentPoll = setInterval(() => {
          try {
            const cur = getComputedStyle(appBg||document.body).backgroundImage;
            if (cur !== this._accentPrevImage) { this._accentPrevImage = cur; this._accentDebounced(); }
          } catch {}
        }, 5000);
      } catch {}
      // Undo/Redo keyboard shortcuts
      window.addEventListener('keydown', this.handleUndoShortcut, { passive: false });
    });
  },
  beforeDestroy(){
    window.removeEventListener('resize', this.updateListHeights);
    window.removeEventListener('click', this.handleGlobalClick);
    window.removeEventListener('keydown', this.handleUndoShortcut);
    if (this._accentDebounced) {
      window.removeEventListener('resize', this._accentDebounced);
      window.removeEventListener('orientationchange', this._accentDebounced);
    }
    if (this._accentObserver) { try { this._accentObserver.disconnect(); } catch {} }
    if (this._accentPoll) { try { clearInterval(this._accentPoll); } catch {} }
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
    listViews: { deep: true, handler() { this.save(); } },
    flowViews: { deep: true, handler() { this.save(); } },
    currentListViewId() { this.save(); },
    currentFlowViewId() { this.save(); },
    tab(newVal) {
      // Recalculate list heights when switching back to Lists
      if (newVal === 'lists') this.$nextTick(this.updateListHeights);
    },
    'ui.listActionsId'(val){
      if (!val) this.ui.listDeleteConfirmId = null;
    },
    'ui.currentViewMenuOpen'(val){
      if (!val) this.ui.currentViewDeleteConfirm = false;
    },
  },

  methods: {
    homeListViewId() {
      return (this.listViews.find(v => (v.name || '').toLowerCase() === 'home')?.id) || (this.listViews[0]?.id || '');
    },
    syncListMembership() {
      try {
        const homeId = this.homeListViewId();
        const map = new Map();
        (this.listViews || []).forEach(v => {
          if (!v) return;
          v.listIds = [];
          map.set(v.id, v);
        });
        (this.lists || []).forEach(list => {
          if (!list) return;
          if (!list.viewId || !map.has(list.viewId)) list.viewId = homeId;
          map.get(list.viewId)?.listIds?.push(list.id);
        });
      } catch {}
    },
    /* --- Views management --- */
    ensureDefaultViews() {
      try {
        const normalizeListViews = () => {
          let homeSeen = false;
          const allIds = (this.lists||[]).map(l=>l.id);
          const dedup = [];
          const seenIds = new Set();
          (Array.isArray(this.listViews) ? this.listViews : []).forEach(v=>{
            if (!v || !v.id || seenIds.has(v.id)) return;
            seenIds.add(v.id);
            if (!Array.isArray(v.listIds)) v.listIds = [];
            if ((v.name||'').toLowerCase() === 'home') {
              if (homeSeen) return;
              homeSeen = true;
              v.listIds = allIds.slice();
            }
            dedup.push(v);
          });
          if (!homeSeen) {
            dedup.unshift({ id: uid(), name: 'Home', listIds: allIds.slice() });
            homeSeen = true;
          }
          this.listViews = dedup;
          if (!this.currentListViewId || !this.listViews.some(v=>v.id===this.currentListViewId)) {
            this.currentListViewId = this.listViews[0]?.id || '';
          }
          this.syncListMembership();
        };
        const normalizeFlowViews = () => {
          let homeSeen = false;
          const allIds = (this.flows||[]).map(f=>f.id);
          const dedup = [];
          const seenIds = new Set();
          (Array.isArray(this.flowViews) ? this.flowViews : []).forEach(v=>{
            if (!v || !v.id || seenIds.has(v.id)) return;
            seenIds.add(v.id);
            if (!Array.isArray(v.flowIds)) v.flowIds = [];
            if ((v.name||'').toLowerCase() === 'home') {
              if (homeSeen) return;
              homeSeen = true;
              v.flowIds = allIds.slice();
            }
            dedup.push(v);
          });
          if (!homeSeen) {
            dedup.unshift({ id: uid(), name: 'Home', flowIds: allIds.slice() });
            homeSeen = true;
          }
          this.flowViews = dedup;
          if (!this.currentFlowViewId || !this.flowViews.some(v=>v.id===this.currentFlowViewId)) {
            this.currentFlowViewId = this.flowViews[0]?.id || '';
          }
        };
        normalizeListViews();
        normalizeFlowViews();
      } catch {}
    },
    saveListViewName(){
      try {
        const v = this.listViews.find(x=>x.id===this.currentListViewId);
        if (!v) return; const name = (this.ui.listViewEditName||'').trim();
        if (!name) { this.ui.listViewNameEditing = false; return; }
        this.mutate('renameListView', ()=>{ v.name = name; });
        this.ui.listViewNameEditing = false;
      } catch {}
    },
    saveFlowViewName(){
      try {
        const v = this.flowViews.find(x=>x.id===this.currentFlowViewId);
        if (!v) return; const name = (this.ui.flowViewEditName||'').trim();
        if (!name) { this.ui.flowViewNameEditing = false; return; }
        this.mutate('renameFlowView', ()=>{ v.name = name; });
        this.ui.flowViewNameEditing = false;
      } catch {}
    },
    startEditListViewName(ev){
      this.ui.listViewNameEditing = true; this.ui.listViewEditName = this.listViewName;
      this.ui.listViewMenuOpen = true;
      this.$nextTick(()=>{ try { this.$refs.listViewNameInput?.focus(); } catch {} this.decideMenuDir('listview', ev); });
    },
    cancelListViewName(){ this.ui.listViewNameEditing = false; },
    startEditFlowViewName(ev){
      this.ui.flowViewNameEditing = true; this.ui.flowViewEditName = this.flowViewName;
      this.ui.flowViewMenuOpen = true;
      this.$nextTick(()=>{ try { this.$refs.flowViewNameInput?.focus(); } catch {} this.decideMenuDir('flowview', ev); });
    },
    cancelFlowViewName(){ this.ui.flowViewNameEditing = false; },

    /* Inline edit across entities */
    startInlineEditList(list, ev){
      this.ui.inlineEditKey = 'list-' + list.id;
      this.ui.inlineEditValue = list.title;
      this.ui.listActionsId = list.id;
      this.$nextTick(()=>{ try { document.getElementById('edit-input-list-'+list.id)?.focus(); } catch {} this.decideMenuDir('list-'+list.id, ev); });
    },
    startInlineEditFlow(flow, ev){
      this.ui.inlineEditKey = 'flow-' + flow.id;
      this.ui.inlineEditValue = flow.title;
      this.ui.flowActionsId = flow.id;
      this.$nextTick(()=>{ try { document.getElementById('edit-input-flow-'+flow.id)?.focus(); } catch {} this.decideMenuDir('flow-'+flow.id, ev); });
    },
    startInlineEditTask(list, t, ev){
      this.ui.inlineEditKey = 'task-' + list.id + '-' + t.id;
      this.ui.inlineEditValue = t.title;
      this.ui.taskActionsId = t.id;
      this.$nextTick(()=>{ try { document.getElementById('edit-input-task-'+list.id+'-'+t.id)?.focus(); } catch {} this.decideMenuDir('task-'+t.id, ev); });
    },
    startInlineEditStepTask(flow, step, ev){
      this.ui.inlineEditKey = 'steptask-' + flow.id + '-' + step.id;
      this.ui.inlineEditValue = step.taskTitle || '';
      this.ui.stepTaskActionsId = step.id;
      this.$nextTick(()=>{ try { document.getElementById('edit-input-steptask-'+flow.id+'-'+step.id)?.focus(); } catch {} this.decideMenuDir('steptask-'+step.id, ev); });
    },
    saveInlineEdit(){
      const key = this.ui.inlineEditKey; if (!key) return;
      const val = (this.ui.inlineEditValue||'').trim(); if (!val) { this.cancelInlineEdit(); return; }
      const parts = key.split('-'); const kind = parts[0];
      this.mutate('inlineEdit', ()=>{
        if (kind==='list') {
          const id = parts[1]; const l = this.lists.find(x=>x.id===id); if (l) { l.title = val; this.listTitles[id] = val; }
        } else if (kind==='flow') {
          const id = parts[1]; const f = this.flows.find(x=>x.id===id); if (f) f.title = val;
        } else if (kind==='task') {
          const lid = parts[1], tid = parts[2];
          const l = this.lists.find(x=>x.id===lid); if (l) { const tt = l.tasks.find(x=>x.id===tid); if (tt) tt.title = val; }
        } else if (kind==='steptask') {
          const fid = parts[1], sid = parts[2];
          const f = this.flows.find(x=>x.id===fid); if (f) { const st = (f.steps||[]).find(s=>s.id===sid); if (st) st.taskTitle = val; }
        }
      });
      this.ui.inlineEditKey = null; this.ui.inlineEditValue = '';
    },
    cancelInlineEdit(){ this.ui.inlineEditKey = null; this.ui.inlineEditValue = ''; },
    switchListView(id){ this.mutate('switchListView', ()=>{ this.currentListViewId = id; this.ui.listViewMenuOpen=false; }); },
    switchFlowView(id){ this.mutate('switchFlowView', ()=>{ this.currentFlowViewId = id; this.ui.flowViewMenuOpen=false; }); },
    addListView(){
      const name = prompt('New view name?', 'New View'); if (!name) return;
      this.mutate('addListView', ()=>{
        const v = { id: uid(), name: name.trim()||'New View', listIds: [] };
        this.listViews.push(v); this.currentListViewId = v.id;
        this.ui.listViewMenuOpen=false;
      });
    },
    addFlowView(){
      const name = prompt('New flow view name?', 'New View'); if (!name) return;
      this.mutate('addFlowView', ()=>{
        const v = { id: uid(), name: name.trim()||'New View', flowIds: [] };
        this.flowViews.push(v); this.currentFlowViewId = v.id;
        this.ui.flowViewMenuOpen=false;
      });
    },
    /* --- Undo/Redo core --- */
    _deepClone(obj){ try { return JSON.parse(JSON.stringify(obj)); } catch { return obj; } },
    pushUndo(label='') {
      try {
        const snap = {
          lists: this._deepClone(this.lists),
          flows: this._deepClone(this.flows),
          history: this._deepClone(this.history),
          listTitles: this._deepClone(this.listTitles),
          listViews: this._deepClone(this.listViews),
          flowViews: this._deepClone(this.flowViews),
          currentListViewId: this.currentListViewId,
          currentFlowViewId: this.currentFlowViewId,
          label,
          ts: Date.now(),
        };
        this.ui.undoStack.push(snap);
        const cap = 100;
        if (this.ui.undoStack.length > cap) this.ui.undoStack.shift();
      } catch {}
    },
    applySnapshot(snap){
      try {
        if (!snap) return;
        this.lists = this._deepClone(snap.lists || []);
        this.flows = this._deepClone(snap.flows || []);
        this.history = this._deepClone(snap.history || {});
        this.listTitles = this._deepClone(snap.listTitles || {});
        if (snap.listViews) this.listViews = this._deepClone(snap.listViews);
        if (snap.flowViews) this.flowViews = this._deepClone(snap.flowViews);
        if (snap.currentListViewId) this.currentListViewId = snap.currentListViewId;
        if (snap.currentFlowViewId) this.currentFlowViewId = snap.currentFlowViewId;
        this.$nextTick(this.updateListHeights);
      } catch {}
    },
    undo(){
      try {
        const prev = this.ui.undoStack.pop();
        if (!prev) return;
        const cur = {
          lists: this._deepClone(this.lists),
          flows: this._deepClone(this.flows),
          history: this._deepClone(this.history),
          listTitles: this._deepClone(this.listTitles),
          listViews: this._deepClone(this.listViews),
          flowViews: this._deepClone(this.flowViews),
          currentListViewId: this.currentListViewId,
          currentFlowViewId: this.currentFlowViewId,
          label: 'redo', ts: Date.now()
        };
        this.ui.redoStack.push(cur);
        this.applySnapshot(prev);
      } catch {}
    },
    redo(){
      try {
        const next = this.ui.redoStack.pop();
        if (!next) return;
        const cur = {
          lists: this._deepClone(this.lists),
          flows: this._deepClone(this.flows),
          history: this._deepClone(this.history),
          listTitles: this._deepClone(this.listTitles),
          listViews: this._deepClone(this.listViews),
          flowViews: this._deepClone(this.flowViews),
          currentListViewId: this.currentListViewId,
          currentFlowViewId: this.currentFlowViewId,
          label: 'undo', ts: Date.now()
        };
        this.ui.undoStack.push(cur);
        this.applySnapshot(next);
      } catch {}
    },
    mutate(label, fn){
      this.pushUndo(label);
      try { fn && fn(); } catch {}
      this.ui.redoStack = [];
      this.$nextTick(this.updateListHeights);
    },
    handleUndoShortcut(e){
      try {
        const tag = (document.activeElement && document.activeElement.tagName || '').toLowerCase();
        const isEditable = document.activeElement && (document.activeElement.isContentEditable || tag==='input' || tag==='textarea');
        if (isEditable) return; // don't hijack typing undo
        const key = (e.key || '').toLowerCase();
        const mod = e.ctrlKey || e.metaKey;
        if (!mod) return;
        if (!e.shiftKey && key === 'z') { e.preventDefault(); this.undo(); }
        else if (key === 'y' || (e.shiftKey && key === 'z')) { e.preventDefault(); this.redo(); }
      } catch {}
    },
    restoreHistoryItem(lid, h) {
      this.mutate('restoreFromHistory', () => {
        try {
          // Find or create the destination list by ID (not name)
          let list = this.lists.find(l=>l.id===lid);
          if (!list) {
            const title = this.listTitles[lid] || 'Restored List';
            list = { id: lid, title, tasks: [] };
            this.lists.push(list);
            this.listTitles[lid] = title;
            // add to current list view membership
            const v = this.listViews.find(x=>x.id===this.currentListViewId);
            if (v && !v.listIds?.includes(list.id)) { (v.listIds||(v.listIds=[])).push(list.id); }
          }
          if (!this.listTitles[lid]) this.listTitles[lid] = list.title;
          const exists = list.tasks.some(t=>t.id===h.id);
          if (!exists) {
            list.tasks.push({
              id: h.id,
              title: h.title,
              fromFlowId: h.fromFlowId || null,
              stepIndex: h.stepIndex ?? null,
            });
          }
          // remove this entry from history (first match by id and timestamp)
          const arr = this.history[lid] || [];
          const idx = arr.findIndex(x=> x===h || (x && x.id===h.id && x.completedAt===h.completedAt));
          if (idx >= 0) arr.splice(idx, 1);
          this.ui.historyActionsKey = null;
        } catch {}
      });
    },
    canRestoreHistory(h){
      if (!h || !h.id) return false;
      if (String(h.id).startsWith('__list_deleted__')) return false;
      return true;
    },
    /* --- drag & drop: tasks --- */
    onTaskRowClick(list, t, ev) {
      if (this.ui.isDragging) return; // ignore clicks during drag
      this.openTaskMenu(list, t, ev);
    },
    onTaskDragStart(list, t, ti, ev) {
      try {
        this.closeAllMenus();
        if (!this.ui.drag) this.ui.drag = {};
        this.ui.isDragging = true;
        const idx = list.tasks.findIndex(x=>x.id===t.id);
        this.ui.drag.taskId = t.id;
        this.ui.drag.srcListId = list.id;
        this.ui.drag.srcIndex = idx >= 0 ? idx : ti;
        if (ev?.dataTransfer) {
          ev.dataTransfer.effectAllowed = 'move';
          try { ev.dataTransfer.setData('text/plain', t.id); } catch {}
        }
      } catch {}
    },
    onTaskDragEnd(ev) {
      this.clearDragState();
    },
    onTaskDragOver(list, t, ti, ev) {
      try {
        const rect = ev.currentTarget?.getBoundingClientRect();
        const mid = rect ? (rect.top + rect.height / 2) : ev.clientY;
        const before = ev.clientY < mid;
        const baseIdx = list.tasks.findIndex(x=>x.id===t.id);
        const idx = baseIdx >= 0 ? baseIdx : ti;
        const dropIndex = before ? idx : idx + 1;
        if (!this.ui.drop) this.ui.drop = {};
        this.ui.drop.listId = list.id;
        this.ui.drop.index = Math.max(0, Math.min(dropIndex, list.tasks.length));
        if (ev?.dataTransfer) ev.dataTransfer.dropEffect = 'move';
      } catch {}
    },
    onTaskDropOnItem(list, t, ti, ev) {
      try {
        if (!this.ui.drop || this.ui.drop.listId !== list.id) {
          // fallback to drop before/after hovered item
          const rect = ev.currentTarget?.getBoundingClientRect();
          const mid = rect ? (rect.top + rect.height / 2) : ev.clientY;
          const before = ev.clientY < mid;
          const baseIdx = list.tasks.findIndex(x=>x.id===t.id);
          const idx = baseIdx >= 0 ? baseIdx : ti;
          const dropIndex = before ? idx : idx + 1;
          this.ui.drop = { listId: list.id, index: Math.max(0, Math.min(dropIndex, list.tasks.length)) };
        }
      } catch {}
      this.commitTaskDrop();
    },
    onListDragOver(list, ev) {
      try {
        if (!this.ui.drop) this.ui.drop = {};
        // Default to end-of-list when hovering container (not a row)
        this.ui.drop.listId = list.id;
        this.ui.drop.index = (list.tasks && list.tasks.length) ? list.tasks.length : 0;
        if (ev?.dataTransfer) ev.dataTransfer.dropEffect = 'move';
      } catch {}
    },
    onListDrop(list, ev) {
      this.commitTaskDrop();
    },
    commitTaskDrop() {
      try {
        const drag = this.ui.drag || {};
        const drop = this.ui.drop || {};
        if (!drag.taskId || !drag.srcListId || !drop.listId || drop.index == null) { this.clearDragState(); return; }
        const srcId = drag.srcListId; const dstId = drop.listId;
        const curInd = drop.index;
        this.mutate('dndMoveTask', () => {
          const srcList = this.lists.find(l=>l.id===srcId);
          const destList = this.lists.find(l=>l.id===dstId);
          if (!srcList || !destList) return;
          const curIdx = srcList.tasks.findIndex(t=>t.id===drag.taskId);
          if (curIdx < 0) return;
          if (srcList.id === destList.id && (curInd === curIdx || curInd === curIdx + 1)) return;
          const [task] = srcList.tasks.splice(curIdx, 1);
          let insert = curInd;
          if (destList.id === srcList.id && insert > curIdx) insert -= 1;
          insert = Math.max(0, Math.min(insert, destList.tasks.length));
          destList.tasks.splice(insert, 0, task);
          this.ui.taskActionsId = null;
        });
      } catch {}
      this.clearDragState();
    },
    clearDragState() {
      try {
        if (this.ui.drag) { this.ui.drag.taskId = null; this.ui.drag.srcListId = null; this.ui.drag.srcIndex = null; }
        if (this.ui.drop) { this.ui.drop.listId = null; this.ui.drop.index = null; }
        this.ui.isDragging = false;
      } catch {}
    },
    taskDnDClass(list, t, ti) {
      try {
        const out = {};
        if (this.ui.drag && this.ui.drag.taskId === t.id) out['dragging'] = true;
        const drop = this.ui.drop;
        if (drop && drop.listId === list.id) {
          const lastIdx = (list.tasks?.length || 0) - 1;
          if (drop.index === ti) out['drop-before'] = true;
          if (drop.index === ti + 1) out['drop-after'] = true;
          if (drop.index === (lastIdx + 1) && ti === lastIdx) out['drop-after'] = true;
        }
        return out;
      } catch { return {}; }
    },
    sampleToDo(){
      const samples = [
        'Polish my dragon armor', 'Refill flux capacitor', 'Call the Bat-Signal guy', 'Train a baby Jedi',
        'Sort infinity stones by color', 'Feed the tribbles (carefully)', 'Polish Mjölnir', 'Recharge arc reactor',
        'Assemble the Fellowship', 'Schedule a holodeck break', 'Debug the Matrix', 'Invite Gandalf for tea',
        'Rotate the Death Star tires', 'Calibrate the proton pack', 'Walk the doggo-saurus', 'Refuel the TARDIS',
        'Sharpen the vibroblade', 'Upgrade Stark nanotech', 'Bake cookies for the Shire', 'Check in on R2-D2',
        'Water the Groot', 'Polish the One Ring (kidding)', 'Catch all the Pokémon', 'Practice Patronus charm',
        'Refold the map to Mordor', 'Craft a lightsaber hilt', 'Assemble Voltron', 'Clean the Batmobile',
        'Reboot HAL (with caution)', 'Charge the sonic screwdriver', 'Teach Balrog to sit (nope)', 'Borrow Hermione’s Time-Turner',
        'Dust the Holocron shelf', 'Prep the portal gun', 'Tune the warp drive', 'Send ravens to Winterfell',
        'Feed Hedwig some treats', 'Polish the Elder Wand', 'Top up Pym particles', 'Arrange Quidditch practice',
        'Bake lembas bread', 'Clean the hoverboard', 'Refit the Normandy', 'Sharpen Master Sword',
        'Tame a chocobo', 'Recharge Nimbus 2000', 'Collect rupees (green ones)', 'Pet the direwolf',
        'Polish the silver surfer', 'Refactor the holocron API'
      ];
      return samples[Math.floor(Math.random()*samples.length)];
    },
    updateAccentFromBackground(){
      try {
        const root = document.documentElement;
        const bgEl = document.querySelector('.app-bg');
        if (!bgEl) return;
        const bi = getComputedStyle(bgEl).backgroundImage;
        const m = bi && bi.match(/url\(["']?(.*?)["']?\)/);
        const src = m && m[1]; if (!src) return;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          try {
            const c = document.createElement('canvas');
            const w = 32, ch = 32; c.width = w; c.height = ch;
            const ctx = c.getContext('2d');
            ctx.drawImage(img, 0, 0, w, ch);
            const data = ctx.getImageData(0,0,w,ch).data;
            let r=0,g=0,b=0,count=0;
            for (let i=0;i<data.length;i+=4){ const rr=data[i], gg=data[i+1], bb=data[i+2], aa=data[i+3]; if (aa<8) continue; r+=rr; g+=gg; b+=bb; count++; }
            if (count===0) return;
            r=Math.round(r/count); g=Math.round(g/count); b=Math.round(b/count);
            // boost saturation/lightness slightly
            const toHsl=(r,g,b)=>{ r/=255; g/=255; b/=255; const max=Math.max(r,g,b),min=Math.min(r,g,b); let h,s,l=(max+min)/2; if(max===min){h=s=0;} else {const d=max-min; s=l>0.5? d/(2-max-min): d/(max+min); switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4;break;} h/=6;} return [h,s,l]; };
            const toRgb=(h,s,l)=>{ let r,g,b; if(s===0){r=g=b=l;} else {const hue2rgb=(p,q,t)=>{ if(t<0) t+=1; if(t>1) t-=1; if(t<1/6) return p+(q-p)*6*t; if(t<1/2) return q; if(t<2/3) return p+(q-p)*(2/3-t)*6; return p;}; const q=l<0.5? l*(1+s): l+s-l*s; const p=2*l-q; r=hue2rgb(p,q,h+1/3); g=hue2rgb(p,q,h); b=hue2rgb(p,q,h-1/3);} return [Math.round(r*255),Math.round(g*255),Math.round(b*255)]; };
            // compute brightest pixel as accent
            let maxY = -1, br=rr, bg=gg, bb=bb; // init with avg
            for (let i=0;i<data.length;i+=4){ const R=data[i], G=data[i+1], B=data[i+2], A=data[i+3]; if(A<8) continue; const Y=0.2126*R+0.7152*G+0.0722*B; if(Y>maxY){ maxY=Y; br=R; bg=G; bb=B; } }
            let [h,s,l]=toHsl(br,bg,bb); s=Math.min(1,s*1.25); l=Math.min(0.9, Math.max(0.5,l*1.1)); const [rr,gg,bb2]=toRgb(h,s,l);
            const hex = '#' + [rr,gg,bb2].map(x=>x.toString(16).padStart(2,'0')).join('');
            // medium overall tone based on average (balanced)
            let [hm,sm,lm]=toHsl(r,g,b); sm=Math.min(0.5, sm*0.8); lm=0.5; const [mr,mg,mb]=toRgb(hm,sm,lm);
            const hexMedium = '#' + [mr,mg,mb].map(x=>x.toString(16).padStart(2,'0')).join('');
            // only update vars if changed to avoid repaint flicker
            const setVar = (k,v)=>{ const cur = getComputedStyle(root).getPropertyValue(k).trim(); if (cur !== v) root.style.setProperty(k, v); };
            setVar('--clr-primary', hex);
            setVar('--accent-bright', hex);
            setVar('--tone-medium', hexMedium);
            setVar('--interactive-hover', `color-mix(in oklab, ${hex} 40%, transparent)`);
          } catch {}
        };
        img.src = src;
      } catch {}
    },
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
          const fudge = 1 / dpr; // ensure list ends just above footer edge
          const listHeightPx = Math.max(0, Math.floor((available - fudge) * dpr) / dpr);
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
        const t = e.target;
        // Close add menu if click outside
        const openAdd = this.ui.listAddMenuId;
        if (openAdd){
          const menu = document.getElementById('add-menu-'+openAdd);
          const anchor = document.getElementById('add-anchor-'+openAdd);
          if (!(menu && (menu===t || menu.contains(t))) && !(anchor && (anchor===t || anchor.contains(t)))) {
            this.toggleAddMenu(null);
          }
        }
        // Close action menus if click outside
    const closeIfOutside = (key, selector)=>{
      const id = this.ui[key]; if(!id) return;
      const el = document.getElementById('menu-'+selector+id);
      const anchor = document.getElementById('anchor-'+selector+id);
      if (el && !(el===t || el.contains(t) || (anchor && (anchor===t || anchor.contains(t))))) {
        this.ui[key]=null;
        if (key==='listActionsId') this.ui.listDeleteConfirmId = null;
        if (key==='currentViewMenuOpen') this.ui.currentViewDeleteConfirm = false;
      }
    };
        closeIfOutside('listActionsId','list-');
        closeIfOutside('flowActionsId','flow-');
        closeIfOutside('stepActionsId','step-');
        closeIfOutside('stepTaskActionsId','steptask-');
        closeIfOutside('taskActionsId','task-');
        closeIfOutside('historyActionsKey','history-');
        if (!this.ui.currentViewMenuOpen) this.ui.currentViewDeleteConfirm = false;
        // close view menus if clicked outside
        try {
          const lv = document.getElementById('menu-listview');
          const la = document.getElementById('anchor-listview');
          if (this.ui.listViewMenuOpen && lv && !(lv===t || lv.contains(t) || (la && (la===t || la.contains(t))))) this.ui.listViewMenuOpen = false;
        } catch {}
        try {
          const fv = document.getElementById('menu-flowview');
          const fa = document.getElementById('anchor-flowview');
          if (this.ui.flowViewMenuOpen && fv && !(fv===t || fv.contains(t) || (fa && (fa===t || fa.contains(t))))) this.ui.flowViewMenuOpen = false;
        } catch {}
        try {
          const cv = document.getElementById('menu-currentview');
          const ca = document.getElementById('anchor-currentview');
          if (this.ui.currentViewMenuOpen && cv && !(cv===t || cv.contains(t) || (ca && (ca===t || ca.contains(t))))) {
            this.ui.currentViewMenuOpen = false;
            this.ui.currentViewDeleteConfirm = false;
          }
        } catch {}
        try {
          const nl = document.getElementById('menu-newlist');
          const na = document.getElementById('anchor-newlist');
          if (this.ui.newListMenuOpen && nl && !(nl===t || nl.contains(t) || (na && (na===t || na.contains(t))))) this.closeNewListMenu();
        } catch {}
      } catch {}
    },
    save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        lists: this.lists,
        flows: this.flows,
        history: this.history,
        listTitles: this.listTitles,
        listViews: this.listViews,
        flowViews: this.flowViews,
        currentListViewId: this.currentListViewId,
        currentFlowViewId: this.currentFlowViewId,
      }));
    },
    tabBtn(n) { return this.tab===n ? 'active font-semibold' : ''; },
    formatTime(ts) { const d = new Date(ts); return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); },
    toggleSideMd() { this.ui.sideOpen = !this.ui.sideOpen; this.$nextTick(this.updateListHeights); },
    closeSide() { this.ui.sideOpen = false; },
    openFromSide(name) { this.tab = name; this.closeSide(); if (name === 'lists') this.$nextTick(this.updateListHeights); },
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
    this.ui.historyActionsKey = null;
    this.ui.listViewMenuOpen = false;
    this.ui.flowViewMenuOpen = false;
    this.ui.currentViewMenuOpen = false;
    this.ui.currentViewDeleteConfirm = false;
    this.ui.draggingListId = null;
    this.ui.draggingListIndex = -1;
    this.ui.listDeleteConfirmId = null;
    this.closeNewListMenu();
  },
    toggleAddMenu(id){
      const opening = this.ui.listAddMenuId !== id;
      this.ui.listAddMenuId = opening ? id : null;
      if (!opening) return;
      this.ui.addMode = 'task';
      this.ui.placeholderSample = this.sampleToDo();
      this.ui.newTaskTitle = this.ui.placeholderSample;
      // default flow selection to first available
      this.ui.selectedFlowId = (this.flows[0] && this.flows[0].id) ? this.flows[0].id : '';
      this.$nextTick(() => this.decideAddMenuPlacement(id));
    },
    toggleNewListMenu(ev){
      const opening = !this.ui.newListMenuOpen;
      this.ui.newListMenuOpen = opening;
      if (opening) {
        this.ui.newListTitle = '';
        try {
          const anchor = ev?.currentTarget || document.getElementById('anchor-newlist');
          const rect = anchor?.getBoundingClientRect();
          if (rect) {
            this.ui.newListMenuPos = {
              top: rect.top + rect.height / 2,
              left: rect.left + rect.width / 2,
            };
          } else {
            this.ui.newListMenuPos = { top: window.innerHeight/2, left: window.innerWidth/2 };
          }
        } catch {
          this.ui.newListMenuPos = { top: window.innerHeight/2, left: window.innerWidth/2 };
        }
        this.$nextTick(()=>{ try { this.$refs.newListInput?.focus(); } catch {} });
      }
    },
    closeNewListMenu(){
      this.ui.newListMenuOpen = false;
      this.ui.newListTitle = '';
    },
    createListFromInput(){
      const title = (this.ui.newListTitle || '').trim();
      if (!title) return;
      this.addList(title);
    },
    askDeleteList(id){
      this.ui.listDeleteConfirmId = id;
      this.$nextTick(()=>{ try { this.$refs['listDeleteConfirmBtn-'+id]?.focus(); } catch {} });
    },
    cancelDeleteList(){
      this.ui.listDeleteConfirmId = null;
    },
    confirmDeleteList(id){
      this.ui.listDeleteConfirmId = null;
      this.ui.listActionsId = null;
      this.removeList(id);
    },
    openViewDeleteConfirm(){
      this.ui.currentViewDeleteConfirm = true;
      this.$nextTick(()=>{ try { this.$refs.viewDeleteConfirmBtn?.focus(); } catch {} });
    },
    newListMenuStyle(){
      const pos = this.ui.newListMenuPos || {};
      const top = typeof pos.top === 'number' ? pos.top : window.innerHeight / 2;
      const left = typeof pos.left === 'number' ? pos.left : window.innerWidth / 2;
      return {
        position: 'absolute',
        top: top + 'px',
        left: left + 'px',
        transform: 'translate(-50%, -50%)'
      };
    },
    toggleCurrentViewMenu(ev){
      const opening = !this.ui.currentViewMenuOpen;
      this.ui.currentViewMenuOpen = opening;
      if (!opening) this.ui.currentViewDeleteConfirm = false;
      this.$nextTick(()=>this.decideMenuDir('currentview', ev));
    },
    deleteCurrentView(){
      const current = this.listViews.find(v=>v.id===this.currentListViewId);
      if (!current || (current.name||'').toLowerCase() === 'home') {
        this.ui.currentViewDeleteConfirm = false;
        this.ui.currentViewMenuOpen = false;
        return;
      }
      this.mutate('deleteListView', ()=>{
        this.listViews = this.listViews.filter(v=>v.id!==current.id);
        const homeId = this.homeListViewId();
        (this.lists||[]).forEach(list=>{
          if (list.viewId === current.id) list.viewId = homeId;
        });
        this.syncListMembership();
        this.currentListViewId = homeId;
      });
      this.ui.currentViewDeleteConfirm = false;
      this.ui.currentViewMenuOpen = false;
    },
    startListDrag(list, idx, ev){
      try {
        ev.dataTransfer?.setData('text/plain', list.id);
        ev.dataTransfer?.setDragImage?.(ev.currentTarget, ev.offsetX, ev.offsetY);
      } catch {}
      this.ui.draggingListId = list.id;
      this.ui.draggingListIndex = idx;
    },
    onListDragOverCard(list, idx, ev){
      ev.preventDefault();
    },
    onListDrop(list, idx, ev){
      ev.preventDefault();
      const dragId = this.ui.draggingListId;
      if (!dragId || dragId === list.id) return;
      const fromIdx = this.lists.findIndex(l=>l.id===dragId);
      const toIdx = this.lists.findIndex(l=>l.id===list.id);
      if (fromIdx < 0 || toIdx < 0 || dragId === list.id) { this.endListDrag(); return; }
      this.mutate('reorderLists', ()=>{
        const moving = this.lists.splice(fromIdx,1)[0];
        let insertIdx = this.lists.findIndex(l=>l.id===list.id);
        if (insertIdx < 0) insertIdx = this.lists.length;
        this.lists.splice(insertIdx,0,moving);
      });
      this.endListDrag();
    },
    endListDrag(){
      this.ui.draggingListId = null;
      this.ui.draggingListIndex = -1;
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
    toggleListActions(id, ev){
      const opening = this.ui.listActionsId !== id;
      this.ui.listActionsId = opening ? id : null;
      if (!opening) this.ui.listDeleteConfirmId = null;
      this.$nextTick(()=>this.decideMenuDir('list-'+id, ev));
    },
    toggleFlowActions(id, ev){ this.ui.flowActionsId = this.ui.flowActionsId===id ? null : id; this.$nextTick(()=>this.decideMenuDir('flow-'+id, ev)); },
    toggleStepActions(id, ev){ this.ui.stepActionsId = this.ui.stepActionsId===id ? null : id; this.$nextTick(()=>this.decideMenuDir('step-'+id, ev)); },
    toggleStepTaskActions(id, ev){ this.ui.stepTaskActionsId = this.ui.stepTaskActionsId===id ? null : id; this.$nextTick(()=>this.decideMenuDir('steptask-'+id, ev)); },
    toggleTaskActions(id, ev){ this.ui.taskActionsId = this.ui.taskActionsId===id ? null : id; this.$nextTick(()=>this.decideMenuDir('task-'+id, ev)); },
    openTaskMenu(list, t, ev){
      const id = t.id;
      this.ui.taskActionsId = this.ui.taskActionsId===id ? null : id;
      this.$nextTick(()=>this.decideMenuDir('task-'+id, ev));
    },
    toggleListViewMenu(ev){
      const opening = !this.ui.listViewMenuOpen;
      this.ui.listViewMenuOpen = opening;
      this.ui.listViewEditName = this.listViewName || '';
      if (opening) {
        this.ui.listViewNameEditing = true;
        this.$nextTick(()=>{ try { this.$refs.listViewNameInput?.focus(); this.$refs.listViewNameInput?.select(); } catch {} this.decideMenuDir('listview', ev); });
      } else {
        this.$nextTick(()=>this.decideMenuDir('listview', ev));
      }
    },
    openListViewEditMenu(ev){
      this.ui.listViewMenuOpen = true;
      this.ui.listViewNameEditing = true;
      this.ui.listViewEditName = this.listViewName || '';
      this.$nextTick(()=>{ try { this.$refs.listViewNameInput?.focus(); } catch {} this.decideMenuDir('listview', ev); });
    },
    toggleFlowViewMenu(ev){
      const opening = !this.ui.flowViewMenuOpen;
      this.ui.flowViewMenuOpen = opening;
      this.ui.flowViewEditName = this.flowViewName || '';
      if (opening) {
        this.ui.flowViewNameEditing = true;
        this.$nextTick(()=>{ try { this.$refs.flowViewNameInput?.focus(); this.$refs.flowViewNameInput?.select(); } catch {} this.decideMenuDir('flowview', ev); });
      } else {
        this.$nextTick(()=>this.decideMenuDir('flowview', ev));
      }
    },
    openFlowViewEditMenu(ev){
      this.ui.flowViewMenuOpen = true;
      this.ui.flowViewNameEditing = true;
      this.ui.flowViewEditName = this.flowViewName || '';
      this.$nextTick(()=>{ try { this.$refs.flowViewNameInput?.focus(); } catch {} this.decideMenuDir('flowview', ev); });
    },
    openHistoryMenu(lid, h, ev){
      const key = lid + '-' + h.id + '-' + (h.completedAt||0);
      this.ui.historyActionsKey = this.ui.historyActionsKey===key ? null : key;
      this.$nextTick(()=>this.decideMenuDir('history-'+key, ev));
    },
    decideMenuDir(key, ev){
      try {
        const anchor = ev?.currentTarget || ev?.target || null;
        const rect = anchor ? anchor.getBoundingClientRect() : null;
        const menu = document.getElementById('menu-'+key);
        const mh = menu?.offsetHeight || 160;
        const margin = 6;
        // Prefer fitting within the list scroll area if available
        const card = anchor ? (anchor.closest('.list-element') || anchor.closest('.list-card')) : null;
        const scroll = card ? card.querySelector('.list-scroll') : null;
        const sr = scroll ? scroll.getBoundingClientRect() : null;
        let dir = 'down';
        if (rect) {
          if (sr) {
            const spaceBelow = sr.bottom - rect.bottom;
            const spaceAbove = rect.top - sr.top;
            if (spaceBelow >= mh + margin) dir = 'down';
            else if (spaceAbove >= mh + margin) dir = 'up';
            else dir = (spaceBelow >= spaceAbove) ? 'down' : 'up';
          } else {
            const spaceBelowWin = window.innerHeight - rect.bottom;
            dir = spaceBelowWin >= mh + margin ? 'down' : 'up';
          }
        }
        this.$set ? this.$set(this.ui.menuDir, key, dir) : (this.ui.menuDir[key]=dir);
      } catch {}
    },

    /* --- lists --- */
    addList(title) {
      const final = (title || '').trim();
      if (!final) return;
      this.mutate('addList', () => {
        const list = { id: uid(), title: final, tasks: [] };
        this.lists.push(list);
        this.listTitles[list.id] = list.title;
        const view = this.listViews.find(v=>v.id===this.currentListViewId) || this.listViews[0];
        if (view) {
          if (!Array.isArray(view.listIds)) view.listIds = [];
          if (!view.listIds.includes(list.id)) view.listIds.push(list.id);
        }
        this.closeAllMenus();
      });
      this.closeNewListMenu();
    },
    renameList(list) {
      const v = prompt('Rename list', list.title); if (!v) return;
      this.mutate('renameList', () => {
        list.title = v.trim();
        this.listTitles[list.id] = list.title;
        this.closeAllMenus();
      });
    },
    removeList(id) {
      this.mutate('removeList', () => {
        // keep history and title for deleted lists
        const list = this.lists.find(l=>l.id===id);
        if (!this.history[id]) this.history[id] = [];
        if (list && Array.isArray(list.tasks)) {
          const ts = Date.now();
          // record each task as a deleted history item
          list.tasks.forEach(t => {
            this.history[id].unshift({
              id: t.id, title: t.title, fromFlowId: t.fromFlowId || null,
              stepIndex: t.stepIndex ?? null, completedAt: ts, action: 'deleted', viewId: this.currentListViewId || null
            });
          });
          // If list has no tasks, ensure it still appears in history
          if (list.tasks.length === 0) {
            this.history[id].unshift({ id: '__list_deleted__'+ts, title: 'List deleted', completedAt: ts, action: 'list-deleted', viewId: this.currentListViewId || null });
          }
        } else {
          // ensure history array exists so list shows up
          this.history[id] = this.history[id] || [];
          const ts = Date.now();
          this.history[id].unshift({ id: '__list_deleted__'+ts, title: 'List deleted', completedAt: ts, action: 'list-deleted', viewId: this.currentListViewId || null });
        }
        this.lists = this.lists.filter(l=>l.id!==id);
        // remove from all views
        this.listViews.forEach(v=>{ v.listIds = (v.listIds||[]).filter(x=>x!==id); });
        this.closeAllMenus();
      });
    },
    promptAddTask(list) {
      const title = prompt('Task title?'); if (!title) return;
      this.mutate('addTaskPrompt', () => {
        list.tasks.push({ id: uid(), title: title.trim(), fromFlowId: null, stepIndex: null });
        this.toggleAddMenu(null);
      });
    },
    addTaskWithTitle(list){
      const t = (this.ui.newTaskTitle || '').trim();
      if (!t) return;
      this.mutate('addTask', () => {
        list.tasks.push({ id: uid(), title: t, fromFlowId: null, stepIndex: null });
        this.toggleAddMenu(null);
      });
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
      const cur = (this.ui.newTaskTitle || '').trim().toLowerCase();
      if (cur === (this.ui.placeholderSample||'').trim().toLowerCase()) {
        this.ui.newTaskTitle = '';
      }
    },
    onTaskTitleBlur(e){
      if (!(this.ui.newTaskTitle || '').trim()) {
        this.ui.placeholderSample = this.sampleToDo();
        this.ui.newTaskTitle = this.ui.placeholderSample;
      }
    },
    editTask(list, t) {
      const v = prompt('Edit task', t.title); if (!v) return;
      this.mutate('editTask', () => { t.title = v.trim(); this.closeAllMenus(); });
    },
    removeTask(list, taskId) {
      this.mutate('removeTask', () => {
        try {
          const t = list.tasks.find(x=>x.id===taskId);
          if (t) {
            if (!this.history[list.id]) this.history[list.id] = [];
            this.history[list.id].unshift({
              id: t.id, title: t.title, fromFlowId: t.fromFlowId || null,
              stepIndex: t.stepIndex ?? null, completedAt: Date.now(), action: 'deleted', viewId: this.currentListViewId || null
            });
          }
        } catch {}
        list.tasks = list.tasks.filter(t=>t.id!==taskId);
        if (this.ui.taskActionsId===taskId) this.ui.taskActionsId = null;
      });
    },

    /* --- flows applied to lists (runtime) --- */
    addFlowToList(list, flowId) {
      const f = this.flows.find(x=>x.id===flowId); if (!f) return;
      const first = f.steps[0];
      this.mutate('addFlowTaskToList', () => {
        if (first?.taskTitle?.trim()) {
          list.tasks.push({
            id: uid(), title: first.taskTitle.trim(), fromFlowId: f.id, stepIndex: 0
          });
        }
        this.toggleAddMenu(null);
        this.ui.selectedFlowId = '';
      });
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
        // record state right before applying the completion change
        this.pushUndo('completeTask');
        if (!this.history[list.id]) this.history[list.id] = [];
        this.history[list.id].unshift({
          id: task.id, title: task.title, fromFlowId: task.fromFlowId || null,
          stepIndex: task.stepIndex ?? null, completedAt: Date.now(), action: 'completed', viewId: this.currentListViewId || null
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
        // clear redo since this was a new mutation
        this.ui.redoStack = [];
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
      this.mutate('addFlow', () => {
        const f = { id: uid(), title: title.trim(), steps: [] };
        this.flows.push(f);
        const v = this.flowViews.find(x=>x.id===this.currentFlowViewId);
        if (v && !v.flowIds?.includes(f.id)) { (v.flowIds||(v.flowIds=[])).push(f.id); }
      });
    },
    renameFlow(flow) {
      const v = prompt('Rename flow', flow.title); if (!v) return;
      this.mutate('renameFlow', () => { flow.title = v.trim(); this.closeAllMenus(); });
    },
    removeFlow(id) {
      if (!confirm('Delete this flow?')) return;
      this.mutate('removeFlow', () => {
        this.flows = this.flows.filter(f=>f.id!==id);
        this.flowViews.forEach(v=>{ v.flowIds = (v.flowIds||[]).filter(x=>x!==id); });
        this.closeAllMenus();
      });
    },
    addStep(flow) {
      const type = prompt('Step type (only "single" available)', 'single');
      if (!type) return;
      this.mutate('addStep', () => { flow.steps.push({ id: uid(), type: type.trim().toLowerCase(), taskTitle: '' }); });
    },
    deleteStep(flow, stepId) {
      this.mutate('deleteStep', () => { flow.steps = flow.steps.filter(s=>s.id!==stepId); this.closeAllMenus(); });
    },
    renameStep(step) {
      const v = prompt('Rename step label (optional note)', step.note || ''); // optional note
      if (v===null) return;
      this.mutate('renameStep', () => { step.note = v.trim(); this.closeAllMenus(); });
    },
    addStepTask(step) {
      const v = prompt('Task title for this step'); if (!v) return;
      this.mutate('addStepTask', () => { step.taskTitle = v.trim(); this.closeAllMenus(); });
    },
    renameStepTask(step) {
      const v = prompt('Edit task title', step.taskTitle || ''); if (!v) return;
      this.mutate('renameStepTask', () => { step.taskTitle = v.trim(); this.closeAllMenus(); });
    },
    removeStepTask(step) {
      this.mutate('removeStepTask', () => { step.taskTitle = ''; this.closeAllMenus(); });
    },
  },
};
</script>

<style>
html, body, #app { height: 100%; margin: 0; }
</style>
