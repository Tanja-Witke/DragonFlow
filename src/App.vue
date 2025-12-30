<template>
  <div class="h-screen w-screen app-bg">
    <div class="flex h-full">
      <!-- SIDE MENU (responsive) -->
      <!-- Overlay for small screens -->
      <div v-if="ui.sideOpen" class="fixed inset-0 bg-black/50 md:hidden" @click="closeSide()"></div>
      <aside
        class="z-20 md:relative md:z-0 h-full side-rail backdrop-blur transition-all duration-300 overflow-hidden"
        :class="sideClass"
        ref="sideRail"
      >
        <div class="h-full flex flex-col">
          <div class="flex items-center justify-between px-3 py-3">
            <div class="flex items-center gap-2 font-semibold">
              <span class="hidden md:inline">ToDojo</span>
            </div>
            <button class="btn-ghost no-hover md:hidden" ref="sideToggleMobile" @click.stop="closeSide" aria-label="Close menu">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6l-12 12"/></svg>
            </button>
          </div>

          <nav class="p-2 space-y-1 text-sm">
            <button class="menu-item w-full flex items-center gap-2" :class="{ 'is-active': tab==='lists' }" @click="openFromSide('lists')">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h12M4 6h.01M8 12h12M4 12h.01M8 18h12M4 18h.01"/></svg>
              <span>Lists</span>
            </button>
            <button class="menu-item w-full flex items-center gap-2" :class="{ 'is-active': tab==='stats' }" @click="openFromSide('stats')">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18"/><path d="M7 16l4-4 3 3 5-7"/></svg>
              <span>Statistics</span>
            </button>
            <div class="divider"></div>
            <button class="menu-item w-full flex items-center gap-2" :class="{ 'is-active': tab==='history' }" @click="openFromSide('history')">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
              <span>History</span>
            </button>
            <button class="menu-item w-full flex items-center gap-2" :class="{ 'is-active': tab==='rules' }" @click="openFromSide('rules')">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5V5a2 2 0 0 1 2-2h12"/><path d="M20 5v15.5a2 2 0 0 0-2.82 0L15 21.67l-2.18-2.18a2 2 0 0 0-2.82 0L8 21.67l-2.18-2.18a2 2 0 0 0-2.82 0"/></svg>
              <span>Rules</span>
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
        <div class="flex flex-wrap items-start justify-between gap-2 px-3 py-2 bg-surface topbar">
          <div class="flex flex-wrap items-center gap-2 min-w-0">
            <button class="btn-ghost no-hover md:hidden" @click.stop="ui.sideOpen = true" aria-label="Open menu">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
            </button>
            <!-- Desktop side toggle on the left -->
            <button class="btn-ghost no-hover hidden md:inline-flex" ref="sideToggleMd" @click.stop="toggleSideMd" title="Toggle menu" aria-label="Toggle side menu">
              <svg v-if="ui.sideOpen" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              <svg v-else class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
            </button>
            <h1 class="text-lg font-semibold min-w-0">
              <span v-if="tab==='lists'">Lists</span>
              <span v-else-if="tab==='history'">History</span>
              <span v-else-if="tab==='rules'">Rules</span>
              <span v-else-if="tab==='settings'">Settings</span>
              <span v-else>Statistics</span>
            </h1>
            <div v-if="tab==='lists'" class="view-path flex flex-wrap items-center gap-1 text-sm w-full sm:w-auto">
              <template v-if="ui.listViewNameEditing">
                <div class="view-edit-inline flex items-center gap-1">
                  <span v-if="ui.listViewEditPrefix" class="text-sec text-xs">{{ ui.listViewEditPrefix }}/</span>
                  <input
                    ref="listViewNameInput"
                    class="inline-edit w-40"
                    v-model.trim="ui.listViewEditName"
                    @click.stop
                    @keydown.enter.stop.prevent="saveListViewName"
                    @keydown.esc.stop.prevent="cancelListViewName"
                    @blur="saveListViewName"
                  />
                </div>
              </template>
              <template v-else>
                <template v-for="(seg, idx) in viewPathSegments" :key="seg.path">
                  <button
                    v-if="idx===viewPathSegments.length-1"
                    class="path-seg is-current"
                    @click.stop="openListViewEditMenu($event)"
                  >
                    {{ seg.label }}
                  </button>
                  <button
                    v-else
                    class="path-seg"
                    @click.stop="jumpToViewPath(seg.path)"
                  >
                    {{ seg.label }}
                  </button>
                  <span v-if="idx!==viewPathSegments.length-1" class="text-sec">/</span>
                </template>
              </template>
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
            <button class="btn-ghost" @click="exportWorkspace" title="Export data" aria-label="Export workspace">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 5v14"/>
                <path d="M5 12l7-7 7 7"/>
                <path d="M5 19h14"/>
              </svg>
            </button>
            <button class="btn-ghost" @click="triggerImportWorkspace" title="Import data" aria-label="Import workspace">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 19V5"/>
                <path d="M19 12l-7 7-7-7"/>
                <path d="M5 5h14"/>
              </svg>
            </button>
            <input ref="importInput" type="file" accept="application/json" class="hidden" @change="handleWorkspaceImport">
            <div class="relative" id="anchor-currentview">
              <button class="btn-ghost no-hover" @click.stop="toggleCurrentViewMenu($event)" aria-label="Current view actions">
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
              </button>
              <div v-if="ui.currentViewMenuOpen" id="menu-currentview" class="menu-pop right" :class="ui.menuDir['currentview'] === 'up' ? 'up' : 'down'">
                <template v-if="(listViewName||'').toLowerCase()==='main'">
                  <div class="menu-item text-muted cursor-default">Main view cannot be deleted</div>
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
              <div ref="listsScroller" class="flex gap-3 h-full overflow-x-auto snap-x snap-mandatory px-3 pb-3 pt-3">
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
                  @dragend="endListDrag()"
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
              <ul
                class="h-full overflow-y-auto overflow-x-hidden scrollbar-left pl-1 vlist list-scroll"
                @scroll="onListScrollDeferred($event)"
                @dragover.prevent="onTaskListDragOver(list, $event)"
                @drop.prevent="onTaskListDrop(list, $event)"
              >
                <li
                  v-for="(t, ti) in list.tasks"
                  :key="t.id"
                  :id="'anchor-task-'+t.id"
                  class="group relative flex gap-2 px-2 py-1 task-item snap-start cursor-pointer"
                  :class="[
                    t.type==='note' ? 'note-entry items-start' : 'items-center',
                    isMilestone(t) ? 'milestone' : '',
                    ui.completing[t.id] ? 'completing' : '',
                    taskDnDClass(list, t, ti)
                  ]"
                  draggable="true"
                  @dragstart="onTaskDragStart(list, t, ti, $event)"
                  @dragend="onTaskDragEnd($event)"
                  @dragover.prevent.stop="onTaskDragOver(list, t, ti, $event)"
                  @drop.stop="onTaskDropOnItem(list, t, ti, $event)"
                  @click.stop="onTaskRowClick(list, t, $event)"
                >
                    <div class="flex-1 min-w-0" :class="t.type==='note' ? 'flex flex-col gap-1' : ''">
                    <div v-if="t.type!=='note'" class="flex items-center gap-2 w-full">
                      <span class="flex-1 text-left leading-tight">
                        {{ linkedViewName(t) || t.title }}
                      </span>
                    </div>
                    <div class="note-body text-sec whitespace-pre-line text-left w-full">
                      {{ t.body }}
                      <span v-if="noteHasChildren(t)" class="note-child-indicator">Sub view available</span>
                    </div>
                  </div>

                  <div v-if="isMilestone(t)" class="milestone-check order-3" :title="milestonePercent(t) + '% complete'">
                    <div class="faux-checkbox locked">
                      <span class="milestone-percent">{{ milestonePercent(t) }}</span>
                    </div>
                  </div>
                  <div v-else-if="noteHasChildren(t)" class="milestone-check order-3" :title="milestonePercent(t) + '% complete'">
                    <div class="faux-checkbox locked">
                      <span class="milestone-percent">{{ milestonePercent(t) }}</span>
                    </div>
                  </div>
                  <input
                    v-else-if="t.type!=='note'"
                    class="order-3"
                    type="checkbox"
                    :checked="false"
                    :disabled="ui.completing[t.id]"
                    @click.stop
                    @change="completeTask(list, t, $event)"
                  />

                    <div v-if="ui.taskActionsId===t.id" :id="'menu-task-'+t.id" class="menu-pop left" :class="ui.menuDir['task-'+t.id] === 'up' ? 'up' : 'down'">
                      <template v-if="ui.menuDir['task-'+t.id] === 'up'">
                        <button class="menu-item danger" @click="removeTask(list, t.id)">Delete</button>
                      </template>
                      <template v-else>
                        <button class="menu-item danger" @click="removeTask(list, t.id)">Delete</button>
                      </template>
                    </div>

                    <div v-if="ui.celebrateTaskId===t.id" class="celebrate-overlay">
                      <span v-for="n in 10" :key="'ray-'+t.id+'-'+n" class="ray" :style="rayStyle(n)"></span>
                    </div>
                  </li>
                </ul>
              </div>

              <div :id="'add-anchor-'+list.id" class="add-footer list-footer group px-2" @click="toggleAddMenu(list.id)">
                <div class="new-btn">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                  <span>Add</span>
                </div>

                <div
                  v-if="ui.listAddMenuId===list.id"
                  :id="'add-menu-'+list.id"
                  class="menu-fab full menu-up space-y-2"
                  @click.stop
                >
                  <div class="space-y-3">
                    <div v-if="ui.addMode==='task'" class="space-y-2">
                      <label class="block text-xs text-sec px-2">Task Title</label>
                      <input
                        v-model.trim="ui.newTaskTitle"
                        :class="['field', ((ui.newTaskTitle||'').trim()===ui.placeholderSample) ? 'placeholder-active' : '']"
                        @focus="onTaskTitleFocus"
                        @blur="onTaskTitleBlur"
                        @keydown.enter.stop.prevent="addTaskWithTitle(list)"
                      />
                    </div>

                    <div v-else-if="ui.addMode==='note'" class="space-y-2">
                      <label class="block text-xs text-sec px-2">Note Details</label>
                      <textarea
                        v-model.trim="ui.newNoteBody"
                        class="field min-h-[90px]"
                        rows="4"
                        @focus="onNoteBodyFocus"
                        @blur="onNoteBodyBlur"
                      ></textarea>
                    </div>

                    <div v-else class="space-y-2 view-mode-panel">
                      <div class="text-xs text-sec px-2">Open a view</div>
                      <div class="view-tree-wrapper compact">
                        <ViewTreeMenu :nodes="viewTree" :current-id="currentListViewId" @select="node => openViewFromTree(node, true)" />
                      </div>
                    </div>

                    <div class="flex gap-2 px-1 add-mode-tabs items-center">
                      <button class="btn-outline flex-1" :class="ui.addMode==='task' ? 'is-active' : ''" @click.stop="setAddMode('task')">Task</button>
                      <button class="btn-outline flex-1" :class="ui.addMode==='note' ? 'is-active' : ''" @click.stop="setAddMode('note')">Note</button>
                      <button class="btn-outline flex-1" :class="ui.addMode==='view' ? 'is-active' : ''" @click.stop="setAddMode('view')">View</button>
                      <button class="btn-primary flex-1" :disabled="!canAddCurrent()" @click.stop="handleAdd(list)">Add</button>
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

          <!-- RULES TAB -->
          <div v-else-if="tab==='rules'" class="h-full p-3 flex flex-col gap-4 overflow-y-auto">
            <div class="surface rounded-2xl p-4 shadow space-y-4">
              <div>
                <h2 class="text-xl font-bold">Automation Rules</h2>
                <p class="text-sec text-sm">Send work from a view into a list on a schedule.</p>
              </div>
              <div class="grid gap-4 md:grid-cols-2">
                <label class="flex flex-col gap-1 text-sm">
                  <span class="text-sec uppercase tracking-wide text-xs">Source view</span>
                  <select class="field" v-model="ui.newRule.viewId">
                    <option disabled value="">Select a view</option>
                    <option v-for="view in listViews" :key="'rule-view-'+view.id" :value="view.id">
                      {{ view.name || 'Untitled view' }}
                    </option>
                  </select>
                </label>
                <label class="flex flex-col gap-1 text-sm">
                  <span class="text-sec uppercase tracking-wide text-xs">Target list</span>
                  <select class="field" v-model="ui.newRule.listId">
                    <option disabled value="">Select a list</option>
                    <option v-for="list in lists" :key="'rule-list-'+list.id" :value="list.id">
                      {{ list.title }}
                    </option>
                  </select>
                </label>
                <label class="flex flex-col gap-1 text-sm">
                  <span class="text-sec uppercase tracking-wide text-xs">Start time</span>
                  <input type="time" class="field" v-model="ui.newRule.time">
                </label>
                <label class="flex flex-col gap-1 text-sm">
                  <span class="text-sec uppercase tracking-wide text-xs">Repeat</span>
                  <select class="field" v-model="ui.newRule.repeat">
                    <option value="once">Once</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </label>
              </div>
              <div class="flex justify-end">
                <button type="button" class="btn-primary" :disabled="!canCreateRule" @click.prevent="createRule">Add rule</button>
              </div>
            </div>
            <div class="flex-1 space-y-3 overflow-y-auto pr-1">
              <div v-if="!rules.length" class="surface rounded-2xl p-4 shadow text-sec text-sm">
                No rules yet. Create one above to start scheduling work.
              </div>
              <div
                v-for="rule in rules"
                :key="rule.id"
                class="surface rounded-2xl p-4 shadow flex flex-col gap-2"
              >
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div class="font-semibold">{{ viewLabelForRule(rule) }} → {{ listTitle(rule.targetListId) }}</div>
                    <div class="text-xs text-sec">{{ ruleSummary(rule) }}</div>
                  </div>
                  <div class="flex gap-2">
                    <button class="btn-outline text-xs" @click="toggleRule(rule)">
                      {{ rule.enabled ? 'Pause' : 'Enable' }}
                    </button>
                    <button class="btn-outline text-xs danger" @click="removeRule(rule.id)">Delete</button>
                  </div>
                </div>
                <div class="text-xs text-muted flex gap-3">
                  <span>Next run: {{ formatNextRun(rule) }}</span>
                  <span v-if="rule.activeCopyId" class="text-primary">Waiting for completion</span>
                </div>
              </div>
            </div>
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
const RESET_FLAG_KEY = STORAGE_KEY + '_reset_import_once';

function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

const ViewTreeMenu = {
  name: 'ViewTreeMenu',
  props: {
    nodes: { type: Array, default: () => [] },
    level: { type: Number, default: 0 },
    currentId: { type: String, default: '' },
  },
  render(h) {
    const nodes = Array.isArray(this.nodes) ? this.nodes : [];
    if (!nodes.length) return null;
    const items = nodes.map(node => {
      const isFolder = node.type === 'folder';
      const isView = node.type === 'view';
      const btnClasses = ['menu-item', 'view-node-btn', node.type];
      if (isView && node.viewId === this.currentId) btnClasses.push('is-active');
      const btn = h('button', {
        class: btnClasses,
        attrs: { type: 'button' },
        on: !isFolder ? {
          click: evt => {
            evt?.stopPropagation?.();
            this.$emit('select', node);
          }
        } : {}
      }, [node.label || node.name || 'Unnamed']);
      const children = [btn];
      if (isFolder && Array.isArray(node.children) && node.children.length) {
        children.push(h('div', { class: 'view-submenu' }, [
          h(ViewTreeMenu, {
            props: { nodes: node.children, level: this.level + 1, currentId: this.currentId },
            on: { select: payload => this.$emit('select', payload) }
          })
        ]));
      }
      return h('li', { class: ['view-node', node.type], key: node.key || node.path || node.viewId }, children);
    });
    return h('ul', { class: ['view-tree-list', `level-${this.level}`] }, items);
  }
};

export default {
  components: { ViewTreeMenu },
  data() {
    return {
      tab: 'lists', // 'lists' | 'history' | 'rules' | 'settings' | 'stats'
      lists: [],
      // Views for lists
      listViews: [], // [{id,name,listIds:[] }]
      currentListViewId: '',
      rules: [],
      history: {}, // { [listId]: [{id,title,type,body?,completedAt,action?: 'completed'|'deleted'}] }
      listTitles: {}, // { [listId]: title } - persists names for deleted lists
      ui: {
        sideOpen: false,
        listAddMenuId: null,
        listAddMenuAbove: false,
        listAddMenuPos: { top: 0, left: 0 },
        newListMenuOpen: false,
        newListTitle: '',
        newListMenuPos: { top: 0, left: 0 },
        addMode: 'task',
        newTaskTitle: '',
        newNoteBody: '',
        placeholderSample: '',
        completing: {},
        celebrateTaskId: null,
        // action menus
        listActionsId: null,
        taskActionsId: null,
        menuDir: {},
        historyActionsKey: null,
        // history stacks
        undoStack: [],
        redoStack: [],
        // view menus
        currentViewMenuOpen: false,
        currentViewDeleteConfirm: false,
        listViewEditName: '',
        listViewNameEditing: false,
        listViewEditPrefix: '',
        inlineEditKey: null,
        inlineEditValue: '',
        draggingListId: null,
        draggingListIndex: -1,
        listDeleteConfirmId: null,
        notePlaceholderSample: '',
        drag: null,
        drop: null,
        isDragging: false,
        cardReturnAnchor: null,
        pendingScrollCardId: null,
        newRule: {
          viewId: '',
          listId: '',
          time: '09:00',
          repeat: 'daily',
        },
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
        'w-60',
        this.ui.sideOpen ? 'translate-x-0' : '-translate-x-72 md:translate-x-0 md:w-0',
        'fixed md:static left-0 top-0 md:top-auto md:left-auto'
      ].join(' ');
    },
    allListIds() {
      const ids = new Set(Object.keys(this.history || {}));
      (this.lists || []).forEach(l => ids.add(l.id));
      return Array.from(ids);
    },
    listViewName() { return (this.listViews.find(v=>v.id===this.currentListViewId)?.name) || 'Main'; },
    viewTree() { return this.buildViewTree(); },
    viewPathSegments() {
      const MAIN = 'Main';
      const view = this.listViews.find(v=>v.id===this.currentListViewId);
      const raw = (view?.name || MAIN).trim() || MAIN;
      const parts = raw.split('/').map(s=>s.trim()).filter(Boolean);
      const segments = parts.length ? parts : [MAIN];
      return segments.map((label, idx) => ({
        label,
        path: segments.slice(0, idx+1).join('/')
      }));
    },
    listsForCurrentView() {
      const homeId = this.homeListViewId();
      const currentId = this.currentListViewId || homeId;
      const targetView = (this.listViews || []).find(v => v.id === currentId);
      const viewId = targetView ? targetView.id : homeId;
      if (!viewId) return this.lists || [];
      return (this.lists || []).filter(list => {
        const owner = (list && list.viewId) ? list.viewId : homeId;
        return owner === viewId;
      });
    },
    canUndo() { return (this.ui.undoStack?.length || 0) > 0; },
    canRedo() { return (this.ui.redoStack?.length || 0) > 0; },
    canCreateRule() {
      const cfg = this.ui.newRule || {};
      return !!(cfg.viewId && cfg.listId && cfg.time);
    },
    viewProgressCache() {
      const cache = {};
      const listsByView = {};
      const homeId = this.homeListViewId();
      (this.lists || []).forEach(list => {
        if (!list) return;
        const vid = list.viewId || homeId;
        if (!listsByView[vid]) listsByView[vid] = [];
        listsByView[vid].push(list);
      });
      const completedByView = {};
      Object.values(this.history || {}).forEach(entries => {
        (entries || []).forEach(entry => {
          if (!entry || entry.action !== 'completed') return;
          const vid = entry.viewId;
          if (!vid) return;
          completedByView[vid] = (completedByView[vid] || 0) + 1;
        });
      });
      const calc = (viewId, stack=[]) => {
        if (!viewId) return { hasContent: false, percent: 0, totalUnits: 0, completedUnits: 0, listCount: 0, cardCount: 0 };
        if (stack.includes(viewId)) return { hasContent: false, percent: 0, totalUnits: 0, completedUnits: 0, listCount: 0, cardCount: 0 };
        if (cache[viewId]) return cache[viewId];
        const lists = listsByView[viewId] || [];
        let cardCount = 0;
        let totalUnits = 0;
        let completedUnits = completedByView[viewId] || 0;
        totalUnits += completedUnits;
        lists.forEach(list => {
          (list.tasks || []).forEach(task => {
            if (!task) return;
            if (task.type === 'note') {
              cardCount += 1;
              return;
            }
            cardCount += 1;
            totalUnits += 1;
            const linkedId = this.getLinkedViewId(task);
            if (linkedId) {
              const child = calc(linkedId, stack.concat(viewId));
              if (child.hasContent) {
                completedUnits += (child.percent || 0) / 100;
              }
            }
          });
        });
        const hasContent = lists.length > 0 || cardCount > 0;
        const percent = totalUnits > 0 ? Math.max(0, Math.min(100, Math.round((completedUnits / totalUnits) * 100))) : 0;
        cache[viewId] = { hasContent, percent, totalUnits, completedUnits, listCount: lists.length, cardCount };
        return cache[viewId];
      };
      const allViewIds = new Set([
        ...Object.keys(listsByView || {}),
        ...(this.listViews || []).map(v => v.id).filter(Boolean)
      ]);
      allViewIds.forEach(id => calc(id));
      return cache;
    },
  },

  created() {
    try {
      if (!localStorage.getItem(RESET_FLAG_KEY)) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(RESET_FLAG_KEY, 'done');
      }
    } catch {}
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const { lists, history, listTitles, listViews, currentListViewId, rules } = JSON.parse(raw);
      this.lists = Array.isArray(lists) ? lists : [];
      this.history = history || {};
      // reconstruct or use stored titles
      this.listTitles = listTitles || {};
      this.lists.forEach(l => { if (!this.listTitles[l.id]) this.listTitles[l.id] = l.title; });
      this.listViews = Array.isArray(listViews) ? listViews : [];
      this.currentListViewId = currentListViewId || '';
      this.rules = Array.isArray(rules) ? rules : [];
      this.normalizeStoredData();
      this.ensureDefaultViews();
      this.normalizeRules();
    } else {
      const initialList = { id: uid(), title: 'My List', tasks: [] };
      this.lists = [initialList];
      this.listTitles[initialList.id] = initialList.title;
      this.history = {};
      this.ensureDefaultViews();
      this.normalizeRules();
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
      this.tickRules();
      this._ruleTicker = setInterval(() => this.tickRules(), 45000);
    });
  },
  beforeDestroy(){
    window.removeEventListener('resize', this.updateListHeights);
    window.removeEventListener('click', this.handleGlobalClick);
    window.removeEventListener('keydown', this.handleUndoShortcut);
    if (this._ruleTicker) { try { clearInterval(this._ruleTicker); } catch {} }
    if (this._accentDebounced) {
      window.removeEventListener('resize', this._accentDebounced);
      window.removeEventListener('orientationchange', this._accentDebounced);
    }
    if (this._accentObserver) { try { this._accentObserver.disconnect(); } catch {} }
    if (this._accentPoll) { try { clearInterval(this._accentPoll); } catch {} }
  },
  watch: {
    lists: { deep: true, handler() { this.save(); } },
    history: { deep: true, handler() { this.save(); } },
    listTitles: { deep: true, handler() { this.save(); } },
    listViews: { deep: true, handler() { this.save(); } },
    rules: { deep: true, handler() { this.save(); } },
    currentListViewId(newVal) {
      this.save();
      this.handleViewChange(newVal);
    },
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
    normalizeStoredData() {
      try {
        (this.lists || []).forEach(list => {
          if (!Array.isArray(list.tasks)) list.tasks = [];
          list.tasks = list.tasks.map(task => this.normalizeTask(task));
        });
        Object.keys(this.history || {}).forEach(key => {
          const raw = this.history[key];
          const entries = Array.isArray(raw) ? raw : [];
          this.history[key] = entries.map(entry => this.normalizeHistoryEntry(entry));
        });
      } catch {}
    },
    normalizeTask(task = {}) {
      const normalized = { ...(task || {}) };
      normalized.id = normalized.id || uid();
      normalized.title = (normalized.title || '').trim() || 'Untitled';
      normalized.type = normalized.type === 'note' ? 'note' : 'task';
      if (normalized.type === 'note') {
        normalized.body = typeof normalized.body === 'string' ? normalized.body : (normalized.body ?? '').toString();
      } else {
        delete normalized.body;
      }
      normalized.children = [];
      normalized.links = Array.isArray(normalized.links) ? normalized.links.filter(l=>l && l.viewId) : [];
      delete normalized.fromFlowId;
      delete normalized.stepIndex;
      return normalized;
    },
    normalizeHistoryEntry(entry = {}) {
      const normalizedTask = this.normalizeTask(entry);
      return {
        id: normalizedTask.id,
        title: normalizedTask.title,
        type: normalizedTask.type,
        body: normalizedTask.type === 'note' ? (normalizedTask.body || '') : '',
        links: Array.isArray(normalizedTask.links) ? normalizedTask.links.slice() : [],
        completedAt: entry.completedAt || Date.now(),
        action: entry.action || 'completed',
        viewId: entry.viewId || null,
      };
    },
    normalizeRules() {
      try {
        const now = Date.now();
        const normalized = [];
        (this.rules || []).forEach(rule => {
          if (!rule) return;
          const id = rule.id || uid();
          const sourceViewId = rule.sourceViewId || rule.viewId || '';
          const targetListId = rule.targetListId || rule.listId || '';
          const timeOfDay = (rule.timeOfDay || rule.time || '09:00').slice(0, 5);
          const repeat = rule.repeat || 'daily';
          const record = {
            id,
            sourceViewId,
            targetListId,
            timeOfDay,
            repeat,
            enabled: rule.enabled !== false,
            nextRunTs: rule.nextRunTs || this.computeNextRunTs({ timeOfDay, repeat }, now),
            deliveredSourceIds: Array.isArray(rule.deliveredSourceIds) ? rule.deliveredSourceIds.filter(Boolean) : [],
            activeCopyId: rule.activeCopyId || null,
            activeSourceId: rule.activeSourceId || null,
            cycleActive: !!rule.cycleActive,
            createdAt: rule.createdAt || now,
            label: rule.label || 'View automation',
          };
          normalized.push(record);
        });
        this.rules = normalized;
      } catch {}
    },
    buildHistoryEntry(task, action='deleted') {
      const normalizedTask = this.normalizeTask(task);
      return {
        id: normalizedTask.id,
        title: normalizedTask.title,
        type: normalizedTask.type,
        body: normalizedTask.type === 'note' ? (normalizedTask.body || '') : '',
        links: Array.isArray(normalizedTask.links) ? normalizedTask.links.slice() : [],
        completedAt: Date.now(),
        action,
        viewId: this.currentListViewId || null,
      };
    },
    buildViewTree() {
      try {
        const root = [];
        const folderMap = new Map();
        const ensureFolder = (segments) => {
          const path = segments.join('/');
          if (folderMap.has(path)) return folderMap.get(path);
          const label = segments[segments.length - 1] || '';
          const node = { type: 'folder', label, path, key: 'folder-' + path, children: [] };
          folderMap.set(path, node);
          if (segments.length === 1) {
            root.push(node);
          } else {
            const parentPath = segments.slice(0, -1).join('/');
            const parent = folderMap.get(parentPath);
            if (parent) parent.children.push(node);
            else root.push(node);
          }
          return node;
        };
        (this.listViews || []).forEach(view => {
          if (!view || !view.id) return;
          const name = (view.name || 'Untitled').trim() || 'Untitled';
          const parts = name.split('/').map(s => s.trim()).filter(Boolean);
          const segments = parts.length ? parts : [name];
          let parentList = root;
          if (segments.length > 1) {
            segments.slice(0, -1).forEach((seg, idx) => {
              const pathSegments = segments.slice(0, idx + 1);
              const folder = ensureFolder(pathSegments);
              parentList = folder.children;
            });
          }
          const label = segments[segments.length - 1];
          parentList.push({
            type: 'view',
            label,
            path: segments.join('/'),
            key: 'view-' + view.id,
            viewId: view.id,
          });
        });
        const sortNodes = list => {
          list.sort((a, b) => {
            if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
            return (a.label || '').localeCompare(b.label || '');
          });
          list.forEach(node => {
            if (node.children) sortNodes(node.children);
          });
        };
        sortNodes(root);
        return root;
      } catch { return []; }
    },
    sanitizeSegment(text){
      return (text || '')
        .replace(/[\\/#?%*:"<>|]/g, '-')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 40) || 'Item';
    },
    getLinkedViewId(task){
      try {
        const link = Array.isArray(task?.links) ? task.links.find(l => l && l.viewId) : null;
        return link?.viewId || '';
      } catch { return ''; }
    },
    getViewProgress(viewId){
      return (this.viewProgressCache && viewId) ? (this.viewProgressCache[viewId] || { hasContent: false, percent: 0 }) : { hasContent: false, percent: 0 };
    },
    milestonePercent(task){
      const viewId = this.getLinkedViewId(task);
      if (!viewId) return 0;
      const stats = this.getViewProgress(viewId);
      return stats?.hasContent ? (stats.percent || 0) : 0;
    },
    viewHasContent(viewId){
      const stats = this.getViewProgress(viewId);
      return !!stats?.hasContent;
    },
    noteHasChildren(task){
      if ((task?.type || 'task') !== 'note') return false;
      const viewId = this.getLinkedViewId(task);
      return !!viewId && this.viewHasContent(viewId);
    },
    isMilestone(task){
      const viewId = this.getLinkedViewId(task);
      if (!viewId) return false;
      return this.viewHasContent(viewId);
    },
    promptNewViewPath(basePath='') {
      const prefix = basePath ? basePath.replace(/\/+$/,'') + '/' : '';
      const input = prompt('Enter new view name', 'New View');
      if (!input) return;
      const raw = (prefix + input).replace(/\/+/g, '/').replace(/^\//, '').replace(/\/$/, '');
      this.addListView(raw);
    },
    jumpToViewPath(path){
      const target = (this.listViews||[]).find(v=> (v.name||'').trim() === path.trim());
      if (!target) return;
      this.switchListView(target.id);
    },
    viewLabel(name='') {
      const parts = (name || '').split('/').map(s=>s.trim()).filter(Boolean);
      if (!parts.length) return name || 'Main';
      return parts[parts.length-1];
    },
    linkedViewName(task){
      try {
        const viewId = this.getLinkedViewId(task);
        if (!viewId) return '';
        const view = this.listViews.find(v=>v.id===viewId);
        return (view?.name || '').split('/').pop() || view?.name || '';
      } catch { return ''; }
    },
    viewLabelForRule(rule){
      const view = this.listViews.find(v=>v.id===rule?.sourceViewId);
      return view?.name || 'Unknown view';
    },
    ruleSummary(rule){
      if (!rule) return '';
      const repeatLabel = rule.repeat === 'weekly' ? 'Weekly'
        : rule.repeat === 'daily' ? 'Daily'
        : 'Once';
      return `${repeatLabel} @ ${rule.timeOfDay || '00:00'}`;
    },
    openItemView(list, task){
      try {
        const originViewId = this.currentListViewId || this.homeListViewId();
        const baseName = (this.listViewName || 'Main').trim() || 'Main';
        const segment = this.sanitizeSegment(task?.title || task?.body || 'Item');
        const fullPath = [baseName, segment].filter(Boolean).join('/').replace(/\/+/g,'/').replace(/^\//,'').replace(/\/$/,'');
        const linkedId = this.getLinkedViewId(task);
        let view = linkedId ? this.listViews.find(v=>v.id===linkedId) : null;
        if (view) {
          if (fullPath && view.name !== fullPath) view.name = fullPath;
        } else {
          view = this.listViews.find(v=> (v.name||'').trim() === fullPath);
          if (!view) {
            view = { id: uid(), name: fullPath || segment || 'Item', listIds: [] };
            this.listViews.push(view);
          }
        }
        if (!Array.isArray(task.links)) task.links = [];
        const existing = task.links.find(l=>l?.viewId===view.id);
        if (existing) {
          task.links = [existing];
        } else {
          task.links = [{ viewId: view.id }];
        }
        this.ui.cardReturnAnchor = { viewId: originViewId, cardId: task.id };
        this.switchListView(view.id);
        this.tab = 'lists';
      } catch {}
    },
    createRule(){
      if (!this.canCreateRule) return;
      const cfg = { ...(this.ui.newRule || {}) };
      this.mutate('createRule', () => {
        const rule = {
          id: uid(),
          sourceViewId: cfg.viewId,
          targetListId: cfg.listId,
          timeOfDay: (cfg.time || '09:00').slice(0,5),
          repeat: cfg.repeat || 'daily',
          enabled: true,
          nextRunTs: this.computeNextRunTs(cfg, Date.now()),
          deliveredSourceIds: [],
          activeCopyId: null,
          activeSourceId: null,
          cycleActive: false,
          createdAt: Date.now(),
          label: 'View automation',
        };
        this.rules.push(rule);
      });
      this.ui.newRule = { viewId: '', listId: '', time: cfg.time || '09:00', repeat: cfg.repeat || 'daily' };
    },
    removeRule(id){
      this.mutate('removeRule', () => {
        this.rules = (this.rules || []).filter(r => r.id !== id);
      });
    },
    toggleRule(rule){
      if (!rule) return;
      this.mutate('toggleRule', () => {
        rule.enabled = !rule.enabled;
        if (!rule.enabled) {
          rule.cycleActive = false;
          rule.activeCopyId = null;
          rule.activeSourceId = null;
        } else if (!rule.nextRunTs) {
          rule.nextRunTs = this.computeNextRunTs(rule, Date.now());
        }
      });
    },
    formatNextRun(rule){
      if (!rule) return '–';
      if (rule.cycleActive && rule.activeCopyId) return 'Active';
      if (!rule.nextRunTs) return 'Ready';
      return this.formatTime(rule.nextRunTs);
    },
    computeNextRunTs(rule, fromTs = Date.now()){
      try {
        const repeat = rule.repeat || 'daily';
        const time = (rule.timeOfDay || rule.time || '09:00').split(':');
        const h = parseInt(time[0], 10) || 0;
        const m = parseInt(time[1], 10) || 0;
        const base = new Date(fromTs);
        base.setSeconds(0, 0);
        base.setHours(h, m, 0, 0);
        if (base.getTime() <= fromTs) {
          base.setDate(base.getDate() + (repeat === 'weekly' ? 7 : 1));
        }
        return base.getTime();
      } catch {
        return Date.now() + 60 * 60 * 1000;
      }
    },
    tickRules(){
      try {
        const now = Date.now();
        (this.rules || []).forEach(rule => {
          if (!rule || !rule.enabled) return;
          if (!rule.cycleActive) {
            if (!rule.nextRunTs) rule.nextRunTs = this.computeNextRunTs(rule, now);
            if (now >= rule.nextRunTs) {
              rule.cycleActive = true;
              rule.deliveredSourceIds = [];
              rule.activeCopyId = null;
              rule.activeSourceId = null;
            } else {
              return;
            }
          }
          if (!rule.activeCopyId) {
            this.deployNextRuleTask(rule);
          }
        });
      } catch {}
    },
    deployNextRuleTask(rule){
      try {
        if (!rule?.cycleActive || rule.activeCopyId) return;
        const candidate = this.findNextRuleCandidate(rule);
        if (!candidate) {
          this.finishRuleCycle(rule);
          return;
        }
        const targetList = this.lists.find(l => l.id === rule.targetListId);
        if (!targetList) {
          this.finishRuleCycle(rule);
          return;
        }
        const sourceTask = candidate.task;
        this.mutate('ruleInject', () => {
          const clone = this.duplicateTaskForRule(sourceTask, rule);
          targetList.tasks = targetList.tasks || [];
          targetList.tasks.push(clone);
          rule.activeCopyId = clone.id;
          rule.activeSourceId = sourceTask.id;
          rule.deliveredSourceIds = rule.deliveredSourceIds || [];
          if (!rule.deliveredSourceIds.includes(sourceTask.id)) rule.deliveredSourceIds.push(sourceTask.id);
        });
      } catch {}
    },
    finishRuleCycle(rule){
      try {
        rule.cycleActive = false;
        rule.activeCopyId = null;
        rule.activeSourceId = null;
        rule.deliveredSourceIds = [];
        if (rule.repeat === 'once') {
          rule.enabled = false;
          rule.nextRunTs = null;
        } else {
          rule.nextRunTs = this.computeNextRunTs(rule, Date.now());
        }
      } catch {}
    },
    findNextRuleCandidate(rule){
      try {
        const delivered = new Set(rule.deliveredSourceIds || []);
        const visited = new Set();
        const walk = (viewId) => {
          if (!viewId || visited.has(viewId)) return null;
          visited.add(viewId);
          const lists = this.getListsForView(viewId);
          for (const list of lists) {
            const tasks = Array.isArray(list.tasks) ? list.tasks : [];
            for (const task of tasks) {
              if (!task || (task.type || 'task') === 'note') continue;
              const nestedView = this.isMilestone(task) ? this.getLinkedViewId(task) : '';
              if (nestedView) {
                const nestedCandidate = walk(nestedView);
                if (nestedCandidate) return nestedCandidate;
                continue;
              }
              if (delivered.has(task.id)) continue;
              return { task, list };
            }
          }
          return null;
        };
        return walk(rule.sourceViewId);
      } catch {
        return null;
      }
    },
    getListsForView(viewId){
      try {
        const view = this.listViews.find(v => v.id === viewId);
        if (!view) return [];
        const ids = Array.isArray(view.listIds) ? view.listIds : [];
        if (ids.length) {
          return ids.map(id => this.lists.find(l => l.id === id)).filter(Boolean);
        }
        const homeId = this.homeListViewId();
        return (this.lists || []).filter(l => (l.viewId || homeId) === viewId);
      } catch { return []; }
    },
    duplicateTaskForRule(task, rule){
      const cloned = this.normalizeTask({
        ...task,
        id: uid(),
        links: [],
      });
      cloned.originRuleId = rule.id;
      cloned.originSourceId = task.id;
      return cloned;
    },
    handleRuleCopyCompletion(task){
      try {
        const ruleId = task?.originRuleId;
        if (!ruleId) return;
        const rule = this.rules.find(r => r.id === ruleId);
        if (!rule) return;
        if (rule.activeCopyId === task.id) {
          rule.activeCopyId = null;
          rule.activeSourceId = null;
        }
        if (rule.cycleActive && rule.enabled) {
          this.deployNextRuleTask(rule);
        }
      } catch {}
    },
    homeListViewId() {
      return (this.listViews.find(v => (v.name || '').toLowerCase() === 'main')?.id) || (this.listViews[0]?.id || '');
    },
    syncListMembership() {
      try {
        const homeId = this.homeListViewId();
        const depth = (name = '') => {
          const parts = (name || '').split('/').map(p => p.trim()).filter(Boolean);
          return parts.length || 1;
        };
        const viewMap = new Map();
        const fallbackOwners = new Map();
        const orderedViews = (this.listViews || [])
          .filter(v => v && v.id)
          .sort((a, b) => depth(b?.name) - depth(a?.name));
        orderedViews.forEach(v => {
          const ids = Array.isArray(v.listIds) ? v.listIds.filter(Boolean) : [];
          const uniqueIds = Array.from(new Set(ids));
          uniqueIds.forEach(listId => {
            if (!fallbackOwners.has(listId)) fallbackOwners.set(listId, v.id);
          });
          v.listIds = [];
          viewMap.set(v.id, v);
        });
        const defaultViewId = viewMap.has(homeId) ? homeId : ((this.listViews || [])[0]?.id || null);
        (this.lists || []).forEach(list => {
          if (!list) return;
          let targetId = list.viewId;
          if (!targetId || !viewMap.has(targetId)) {
            targetId = fallbackOwners.get(list.id);
          }
          if (!targetId || !viewMap.has(targetId)) {
            targetId = defaultViewId;
          }
          list.viewId = targetId;
          const targetView = targetId ? viewMap.get(targetId) : null;
          if (targetView) {
            if (!Array.isArray(targetView.listIds)) targetView.listIds = [];
            if (!targetView.listIds.includes(list.id)) targetView.listIds.push(list.id);
          }
        });
      } catch {}
    },
    /* --- Views management --- */
    ensureDefaultViews() {
      try {
        const MAIN = 'Main';
        const allIds = (this.lists||[]).map(l=>l.id);
        const dedup = [];
        const seenIds = new Set();
        let mainSeen = false;
        (Array.isArray(this.listViews) ? this.listViews : []).forEach(v=>{
          if (!v || !v.id || seenIds.has(v.id)) return;
          seenIds.add(v.id);
          const name = (v.name || '').trim();
          if (!name) v.name = MAIN;
          if (name.toLowerCase() === 'home') v.name = MAIN;
          if (!Array.isArray(v.listIds) || !v.listIds.length) v.listIds = [];
          if ((v.name||'').toLowerCase() === MAIN.toLowerCase()) {
            if (mainSeen) return;
            mainSeen = true;
            v.listIds = allIds.slice();
          }
          dedup.push(v);
        });
        if (!mainSeen) {
          dedup.unshift({ id: uid(), name: MAIN, listIds: allIds.slice() });
          mainSeen = true;
        }
        this.listViews = dedup;
        if (!this.currentListViewId || !this.listViews.some(v=>v.id===this.currentListViewId)) {
          this.currentListViewId = this.listViews[0]?.id || '';
        }
        this.syncListMembership();
      } catch {}
    },
    saveListViewName(){
      try {
        const v = this.listViews.find(x=>x.id===this.currentListViewId);
        if (!v) return;
        const label = (this.ui.listViewEditName||'').trim();
        if (!label) { this.cancelListViewName(); return; }
        const prefix = (this.ui.listViewEditPrefix||'').trim().replace(/\/+$/,'');
        const combined = prefix ? `${prefix}/${label}` : label;
        const name = combined.replace(/\/+/g,'/').replace(/^\//,'').replace(/\/$/,'') || 'Main';
        this.mutate('renameListView', ()=>{ v.name = name; });
        this.ui.listViewEditPrefix = '';
        this.ui.listViewNameEditing = false;
      } catch {}
    },
    cancelListViewName(){ this.ui.listViewNameEditing = false; this.ui.listViewEditPrefix=''; },

    /* Inline edit across entities */
    startInlineEditList(list, ev){
      this.ui.inlineEditKey = 'list-' + list.id;
      this.ui.inlineEditValue = list.title;
      this.ui.listActionsId = list.id;
      this.$nextTick(()=>{ try { document.getElementById('edit-input-list-'+list.id)?.focus(); } catch {} this.decideMenuDir('list-'+list.id, ev); });
    },
    startInlineEditTask(list, t, ev){
      this.ui.inlineEditKey = 'task-' + list.id + '-' + t.id;
      this.ui.inlineEditValue = t.title;
      this.ui.taskActionsId = t.id;
      this.$nextTick(()=>{ try { document.getElementById('edit-input-task-'+list.id+'-'+t.id)?.focus(); } catch {} this.decideMenuDir('task-'+t.id, ev); });
    },
    saveInlineEdit(){
      const key = this.ui.inlineEditKey; if (!key) return;
      const val = (this.ui.inlineEditValue||'').trim(); if (!val) { this.cancelInlineEdit(); return; }
      const parts = key.split('-'); const kind = parts[0];
      this.mutate('inlineEdit', ()=>{
        if (kind==='list') {
          const id = parts[1]; const l = this.lists.find(x=>x.id===id); if (l) { l.title = val; this.listTitles[id] = val; }
        } else if (kind==='task') {
          const lid = parts[1], tid = parts[2];
          const l = this.lists.find(x=>x.id===lid);
          if (l) {
            const tt = l.tasks.find(x=>x.id===tid);
            if (tt) {
              tt.title = val;
              const linkedId = this.getLinkedViewId(tt);
              if (linkedId) {
                const view = this.listViews.find(v=>v.id===linkedId);
                if (view) {
                  const rawName = (view.name || '').trim();
                  const segments = rawName ? rawName.split('/').map(s=>s.trim()).filter(Boolean) : [];
                  const prefix = segments.slice(0, -1).join('/');
                  const last = this.sanitizeSegment(val) || 'Item';
                  const combined = prefix ? `${prefix}/${last}` : last;
                  view.name = combined;
                }
              }
            }
          }
        }
      });
      this.ui.inlineEditKey = null; this.ui.inlineEditValue = '';
    },
    cancelInlineEdit(){ this.ui.inlineEditKey = null; this.ui.inlineEditValue = ''; },
    switchListView(id){ this.mutate('switchListView', ()=>{ this.currentListViewId = id; }); },
    addListView(nameInput){
      const raw = (nameInput !== undefined) ? nameInput : prompt('New view name?', 'New View');
      const final = (raw || '').trim();
      if (!final) return;
      this.mutate('addListView', ()=>{
        const v = { id: uid(), name: final || 'New View', listIds: [] };
        this.listViews.push(v); this.currentListViewId = v.id;
      });
    },
    /* --- Undo/Redo core --- */
    _deepClone(obj){ try { return JSON.parse(JSON.stringify(obj)); } catch { return obj; } },
    pushUndo(label='') {
      try {
        const snap = {
          lists: this._deepClone(this.lists),
          history: this._deepClone(this.history),
          listTitles: this._deepClone(this.listTitles),
          listViews: this._deepClone(this.listViews),
          rules: this._deepClone(this.rules),
          currentListViewId: this.currentListViewId,
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
        this.history = this._deepClone(snap.history || {});
        this.listTitles = this._deepClone(snap.listTitles || {});
        this.listViews = this._deepClone(snap.listViews || []);
        this.rules = this._deepClone(snap.rules || []);
        this.currentListViewId = snap.currentListViewId || '';
        this.normalizeStoredData();
        this.ensureDefaultViews();
        this.normalizeRules();
        this.$nextTick(this.updateListHeights);
      } catch {}
    },
    undo(){
      try {
        const prev = this.ui.undoStack.pop();
        if (!prev) return;
        const cur = {
          lists: this._deepClone(this.lists),
          history: this._deepClone(this.history),
          listTitles: this._deepClone(this.listTitles),
          listViews: this._deepClone(this.listViews),
          rules: this._deepClone(this.rules),
          currentListViewId: this.currentListViewId,
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
          history: this._deepClone(this.history),
          listTitles: this._deepClone(this.listTitles),
          listViews: this._deepClone(this.listViews),
          rules: this._deepClone(this.rules),
          currentListViewId: this.currentListViewId,
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
    exportWorkspace(){
      try {
        const payload = {
          version: 1,
          exportedAt: new Date().toISOString(),
          data: {
            lists: this._deepClone(this.lists),
            history: this._deepClone(this.history),
            listTitles: this._deepClone(this.listTitles),
            listViews: this._deepClone(this.listViews),
            currentListViewId: this.currentListViewId,
            rules: this._deepClone(this.rules),
          },
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const stamp = new Date().toISOString().replace(/[:.]/g, '-');
        const a = document.createElement('a');
        a.href = url;
        a.download = `todojo-export-${stamp}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch {}
    },
    triggerImportWorkspace(){
      try {
        this.$refs.importInput?.click();
      } catch {}
    },
    handleWorkspaceImport(event){
      try {
        const input = event?.target;
        const file = input?.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const text = reader.result;
            const parsed = JSON.parse(text);
            this.applyImportedWorkspace(parsed);
          } catch {}
          if (input) input.value = '';
        };
        reader.readAsText(file);
      } catch {
        if (event?.target) event.target.value = '';
      }
    },
    applyImportedWorkspace(payload){
      try {
        const pack = payload?.data ? payload.data : payload;
        if (!pack) return;
        this.mutate('importWorkspace', () => {
          this.lists = Array.isArray(pack.lists) ? this._deepClone(pack.lists) : [];
          this.history = pack.history ? this._deepClone(pack.history) : {};
          this.listTitles = pack.listTitles ? this._deepClone(pack.listTitles) : {};
          this.listViews = Array.isArray(pack.listViews) ? this._deepClone(pack.listViews) : [];
          this.currentListViewId = pack.currentListViewId || '';
          this.rules = Array.isArray(pack.rules) ? this._deepClone(pack.rules) : [];
          this.normalizeStoredData();
          this.ensureDefaultViews();
          this.normalizeRules();
        });
      } catch {}
    },
    handleViewChange(viewId){
      try {
        if (!viewId) return;
        const anchor = this.ui.cardReturnAnchor;
        if (anchor && anchor.viewId === viewId && anchor.cardId) {
          this.scheduleScrollToCard(anchor.cardId);
          this.ui.cardReturnAnchor = null;
        } else if (this.ui.pendingScrollCardId) {
          this.scheduleScrollToCard(this.ui.pendingScrollCardId);
        }
      } catch {}
    },
    scheduleScrollToCard(cardId){
      if (!cardId) return;
      this.ui.pendingScrollCardId = cardId;
      this.$nextTick(()=>this.scrollCardIntoView(cardId));
    },
    scrollCardIntoView(cardId, attempt=0){
      try {
        const container = this.$refs.listsScroller;
        if (!container) {
          if (attempt < 5) setTimeout(()=>this.scrollCardIntoView(cardId, attempt+1), 120);
          return;
        }
        const anchorEl = document.getElementById('anchor-task-'+cardId);
        if (!anchorEl) {
          if (attempt < 5) setTimeout(()=>this.scrollCardIntoView(cardId, attempt+1), 120);
          return;
        }
        const listCard = anchorEl.closest('.list-card') || anchorEl.closest('.list-element') || anchorEl;
        const containerRect = container.getBoundingClientRect();
        const listRect = listCard.getBoundingClientRect();
        const delta = listRect.left - containerRect.left;
        const padding = 24;
        const target = Math.max(container.scrollLeft + delta - padding, 0);
        container.scrollTo({ left: target, behavior: 'smooth' });
        this.ui.pendingScrollCardId = null;
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
            list.tasks.push(this.normalizeTask({
              id: h.id,
              title: h.title,
              type: h.type,
              body: h.body,
              links: Array.isArray(h.links) ? h.links.slice() : [],
            }));
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
    sampleNote(){
      const lines = [
        '“Roads? Where we’re going, we don’t need roads.” – Doc Brown',
        '“May the Force be with you.” – Obi-Wan Kenobi',
        '“To infinity and beyond!” – Buzz Lightyear',
        '“I solemnly swear I am up to no good.” – Marauder’s Map',
        '“Just keep swimming.” – Dory',
        '“Great Scott!” – Doc Brown',
        '“This is the way.” – Din Djarin',
        '“I am Groot.” – Groot',
        '“You’re gonna need a bigger boat.” – Chief Brody',
        '“Here’s looking at you, kid.” – Rick Blaine',
        '“I’m Batman.” – Batman',
        '“I’ll be back.” – Terminator'
      ];
      return lines[Math.floor(Math.random() * lines.length)];
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
        closeIfOutside('taskActionsId','task-');
        closeIfOutside('historyActionsKey','history-');
        if (!this.ui.currentViewMenuOpen) this.ui.currentViewDeleteConfirm = false;
        // close view menus if clicked outside
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
        if (this.ui.sideOpen) {
          const side = this.$refs.sideRail;
          const toggles = [this.$refs.sideToggleMd, this.$refs.sideToggleMobile];
          const clickedToggle = toggles.some(btn => btn && (btn === t || btn.contains(t)));
          if (side && !side.contains(t) && !clickedToggle) {
            this.closeSide();
          }
        }
      } catch {}
    },
    save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        lists: this.lists,
        history: this.history,
        listTitles: this.listTitles,
        listViews: this.listViews,
        currentListViewId: this.currentListViewId,
        rules: this.rules,
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
    this.ui.listAddMenuId = null;
    this.ui.listActionsId = this.ui.taskActionsId = null;
    this.ui.historyActionsKey = null;
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
      const list = this.lists.find(l=>l.id===id);
      const last = list?.tasks?.[list.tasks.length-1];
      if (last?.type === 'note') this.ui.addMode = 'note';
      else this.ui.addMode = 'task';
      this.ui.placeholderSample = this.sampleToDo();
      this.ui.newTaskTitle = this.ui.placeholderSample;
      this.ui.notePlaceholderSample = this.sampleNote();
      this.ui.newNoteBody = this.ui.notePlaceholderSample;
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
      if (!current || (current.name||'').toLowerCase() === 'main') {
        this.ui.currentViewDeleteConfirm = false;
        this.ui.currentViewMenuOpen = false;
        return;
      }
      this.mutate('deleteListView', ()=>{
        const targetName = (current.name || '').trim();
        const toRemove = new Set(
          (this.listViews||[])
            .filter(v=>{
              const name = (v.name||'').trim();
              return name === targetName || name.startsWith(targetName + '/');
            })
            .map(v=>v.id)
        );
        this.listViews = this.listViews.filter(v=>!toRemove.has(v.id));
        const homeId = this.homeListViewId();
        (this.lists||[]).forEach(list=>{
          if (toRemove.has(list.viewId)) list.viewId = homeId;
          if (!Array.isArray(list.tasks)) return;
          list.tasks = list.tasks.filter(task=>{
            const links = Array.isArray(task.links) ? task.links : [];
            if (links.some(l=>toRemove.has(l?.viewId))) return false;
            return true;
          });
        });
        this.syncListMembership();
        if (!this.listViews.some(v=>v.id===this.currentListViewId)) {
          this.currentListViewId = homeId;
        }
      });
      this.ui.currentViewDeleteConfirm = false;
      this.ui.currentViewMenuOpen = false;
    },
    openViewFromTree(node, closeAddMenu=false){
      if (!node || node.type!=='view' || !node.viewId) return;
      this.switchListView(node.viewId);
      if (closeAddMenu) this.toggleAddMenu(null);
    },
    startListDrag(list, idx, ev){
      try {
        if (ev?.target?.closest('.task-item')) {
          ev?.preventDefault?.();
          return;
        }
        ev.dataTransfer?.setData('text/plain', list.id);
        ev.dataTransfer?.setDragImage?.(ev.currentTarget, ev.offsetX, ev.offsetY);
      } catch {}
      this._dragOriginalOrder = this._deepClone(this.lists);
      this.ui.draggingListId = list.id;
      this.ui.draggingListIndex = idx;
    },
    onListDragOverCard(list, idx, ev){
      ev.preventDefault();
      const dragId = this.ui.draggingListId;
      if (!dragId || dragId === list.id) return;
      const rect = ev?.currentTarget?.getBoundingClientRect();
      const width = rect?.width || 1;
      const x = rect ? ev.clientX - rect.left : width / 2;
      const ratio = Math.min(Math.max(x / width, 0), 1);
      const place = ratio <= 0.45 ? 'before' : 'after';
      this.previewListReorder(dragId, list.id, place);
    },
    onListDrop(list, idx, ev){
      ev.preventDefault();
      const dragId = this.ui.draggingListId;
      const original = this._dragOriginalOrder;
      if (!dragId || !original) { this.endListDrag(true); return; }
      const finalOrder = this._deepClone(this.lists);
      const changed = JSON.stringify(original.map(l=>l.id)) !== JSON.stringify(finalOrder.map(l=>l.id));
      this._dragOriginalOrder = null;
      if (!changed) { this.endListDrag(true); return; }
      this.lists = original;
      this.mutate('reorderLists', ()=>{
        this.lists = finalOrder;
      });
      this.endListDrag(true);
    },
    endListDrag(success=false){
      if (!success && this._dragOriginalOrder) {
        this.lists = this._dragOriginalOrder;
      }
      this._dragOriginalOrder = null;
      this.ui.draggingListId = null;
      this.ui.draggingListIndex = -1;
    },
    previewListReorder(dragId, targetId, place='before'){
      const fromIdx = this.lists.findIndex(l=>l.id===dragId);
      const toIdx = this.lists.findIndex(l=>l.id===targetId);
      if (fromIdx < 0 || toIdx < 0) return;
      if (fromIdx === toIdx && place === 'before') return;
      const [moving] = this.lists.splice(fromIdx, 1);
      let insertIdx = this.lists.findIndex(l=>l.id===targetId);
      if (insertIdx < 0) insertIdx = this.lists.length;
      if (place === 'after') insertIdx += 1;
      insertIdx = Math.max(0, Math.min(insertIdx, this.lists.length));
      this.lists.splice(insertIdx, 0, moving);
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
    toggleTaskActions(id, ev){ this.ui.taskActionsId = this.ui.taskActionsId===id ? null : id; this.$nextTick(()=>this.decideMenuDir('task-'+id, ev)); },
    openTaskMenu(list, t, ev){
      const id = t.id;
      this.ui.taskActionsId = this.ui.taskActionsId===id ? null : id;
      this.$nextTick(()=>this.decideMenuDir('task-'+id, ev));
    },
    openListViewEditMenu(ev){
      const v = this.listViews.find(x=>x.id===this.currentListViewId);
      const raw = (v?.name || 'Main').trim() || 'Main';
      const parts = raw.split('/').map(s=>s.trim()).filter(Boolean);
      const prefix = parts.slice(0, -1).join('/');
      const label = parts.length ? parts[parts.length-1] : raw;
      this.ui.listViewEditPrefix = prefix;
      this.ui.listViewEditName = label;
      this.ui.listViewNameEditing = true;
      this.$nextTick(()=>{ try { this.$refs.listViewNameInput?.focus(); } catch {} });
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
        const homeId = this.homeListViewId();
        if (view && view.id) {
          list.viewId = view.id;
          if (!Array.isArray(view.listIds)) view.listIds = [];
          if (!view.listIds.includes(list.id)) view.listIds.push(list.id);
        } else {
          list.viewId = homeId;
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
            const entry = this.buildHistoryEntry(t, 'deleted');
            entry.completedAt = ts;
            this.history[id].unshift(entry);
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
        list.tasks.push({ id: uid(), type: 'task', title: title.trim() });
        this.toggleAddMenu(null);
      });
    },
    addTaskWithTitle(list){
      const t = (this.ui.newTaskTitle || '').trim();
      if (!t) return;
      this.mutate('addTask', () => {
        list.tasks.push({ id: uid(), type: 'task', title: t });
        this.toggleAddMenu(null);
      });
    },
    addNoteToList(list){
      const rawInput = this.ui.newNoteBody != null ? this.ui.newNoteBody.toString() : '';
      const trimmed = rawInput.trim();
      const placeholder = (this.ui.notePlaceholderSample||'').trim();
      const body = trimmed && trimmed !== placeholder ? rawInput : this.sampleNote();
      if (!body) return;
      this.mutate('addNote', () => {
        const note = this.normalizeTask({ id: uid(), type: 'note', title: body.slice(0, 48) || 'Note', body });
        list.tasks.push(note);
        this.ui.newNoteBody = '';
        this.toggleAddMenu(null);
      });
    },
    canAddCurrent(){
      if (this.ui.addMode === 'task') return !!(this.ui.newTaskTitle || '').trim();
      if (this.ui.addMode === 'note') {
        const body = (this.ui.newNoteBody || '').trim();
        const placeholder = (this.ui.notePlaceholderSample || '').trim();
        return body && body !== placeholder;
      }
      if (this.ui.addMode === 'view') return true;
      return false;
    },
    handleAdd(list){
      if (this.ui.addMode === 'task') {
        this.addTaskWithTitle(list);
      } else if (this.ui.addMode === 'note') {
        this.addNoteToList(list);
      } else if (this.ui.addMode === 'view') {
        this.promptNewViewPath(this.listViewName);
        this.toggleAddMenu(null);
      }
    },
    setAddMode(mode){
      this.ui.addMode = mode;
      if (mode === 'task') {
        if (!this.ui.newTaskTitle) this.ui.newTaskTitle = 'ToDo';
      } else if (mode === 'view') {
        this.ui.newNoteBody = '';
      } else if (mode === 'note') {
        if (!this.ui.newNoteBody) {
          this.ui.notePlaceholderSample = this.sampleNote();
          this.ui.newNoteBody = this.ui.notePlaceholderSample;
        }
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
    onNoteBodyFocus(){
      if ((this.ui.newNoteBody || '').trim() === (this.ui.notePlaceholderSample||'').trim()) {
        this.ui.newNoteBody = '';
      }
    },
    onNoteBodyBlur(){
      if (!(this.ui.newNoteBody || '').trim()) {
        this.ui.notePlaceholderSample = this.sampleNote();
        this.ui.newNoteBody = this.ui.notePlaceholderSample;
      }
    },
    editTask(list, t) {
      const v = prompt('Edit task', t.title); if (!v) return;
      this.mutate('editTask', () => { t.title = v.trim(); this.closeAllMenus(); });
    },
    removeTask(list, taskId) {
      this.mutate('removeTask', () => {
        try {
          const t = (list.tasks||[]).find(x=>x.id===taskId);
          if (t) {
            if (!this.history[list.id]) this.history[list.id] = [];
            this.history[list.id].unshift(this.buildHistoryEntry(t, 'deleted'));
          }
        } catch {}
        list.tasks = (list.tasks||[]).filter(t=>t.id!==taskId);
        if (this.ui.taskActionsId===taskId) this.ui.taskActionsId = null;
      });
    },
    onTaskDragStart(list, task, index, ev){
      try {
        ev?.stopPropagation?.();
        this.closeAllMenus();
        this.ui.drag = { taskId: task.id, srcListId: list.id, srcIndex: index };
        this.ui.drop = { listId: list.id, index };
        this.ui.isDragging = true;
        this._taskOriginalOrder = this._deepClone(this.lists);
        ev?.dataTransfer?.setData('text/plain', task.id);
        ev?.dataTransfer && (ev.dataTransfer.effectAllowed = 'move');
      } catch {}
    },
    onTaskDragEnd(ev){
      if (!this._taskOriginalOrder) return;
      this.endTaskDrag(false);
    },
    onTaskDragOver(list, task, index, ev){
      try {
        if (!this.ui.drag?.taskId) return;
        const rect = ev?.currentTarget?.getBoundingClientRect();
        const ratio = rect ? ((ev.clientY - rect.top) / Math.max(rect.height, 1)) : 0.5;
        const insertIdx = ratio <= 0.4 ? index : index + 1;
        this.previewTaskReorder(list.id, insertIdx);
      } catch {}
    },
    onTaskDropOnItem(list, task, index, ev){
      ev.preventDefault();
      try {
        const rect = ev?.currentTarget?.getBoundingClientRect();
        const ratio = rect ? ((ev.clientY - rect.top) / Math.max(rect.height, 1)) : 0.5;
        const insertIdx = ratio <= 0.4 ? index : index + 1;
        this.previewTaskReorder(list.id, insertIdx);
      } catch {}
      this.commitTaskDrop();
    },
    onTaskListDragOver(list, ev){
      try {
        if (!this.ui.drag?.taskId) return;
        const rect = ev?.currentTarget?.getBoundingClientRect();
        const y = rect ? ev.clientY - rect.top : 0;
        const height = rect?.height || 1;
        const ratio = Math.min(Math.max(y / height, 0), 1);
        const length = list.tasks?.length || 0;
        const insertIdx = Math.max(0, Math.min(length, Math.floor(ratio * (length + 0.6))));
        this.previewTaskReorder(list.id, insertIdx);
        ev?.dataTransfer && (ev.dataTransfer.dropEffect = 'move');
      } catch {}
    },
    onTaskListDrop(list, ev){
      ev.preventDefault();
      this.commitTaskDrop();
    },
    previewTaskReorder(targetListId, insertIdx){
      try {
        const dragState = this.ui.drag;
        if (!dragState?.taskId) return;
        const dragId = dragState.taskId;
        const sourceList = (this.lists||[]).find(l => (l.tasks||[]).some(t=>t.id===dragId));
        const targetList = this.lists.find(l=>l.id===targetListId);
        if (!sourceList || !targetList) return;
        const fromIdx = sourceList.tasks.findIndex(t=>t.id===dragId);
        if (fromIdx < 0) return;
        const [task] = sourceList.tasks.splice(fromIdx,1);
        let targetIdx = Math.max(0, Math.min(insertIdx, targetList.tasks.length));
        if (sourceList.id === targetList.id && targetIdx > fromIdx) targetIdx -= 1;
        const prevDrop = this.ui.drop;
        if (prevDrop && prevDrop.listId === targetList.id && prevDrop.index === targetIdx) {
          sourceList.tasks.splice(fromIdx,0,task);
          return;
        }
        targetList.tasks.splice(targetIdx,0,task);
        this.ui.drop = { listId: targetList.id, index: targetIdx };
      } catch {}
    },
    commitTaskDrop(){
      try {
        const original = this._taskOriginalOrder;
        if (!original) { this.endTaskDrag(true); return; }
        const finalOrder = this._deepClone(this.lists);
        const changed = JSON.stringify(original.map(l=>l.tasks.map(t=>t.id))) !== JSON.stringify(finalOrder.map(l=>l.tasks.map(t=>t.id)));
        this._taskOriginalOrder = null;
        if (!changed) { this.endTaskDrag(true); return; }
        this.lists = original;
        this.mutate('moveTask', ()=>{ this.lists = finalOrder; });
      } catch {}
      this.endTaskDrag(true);
    },
    endTaskDrag(success){
      if (!success && this._taskOriginalOrder) {
        this.lists = this._taskOriginalOrder;
      }
      this._taskOriginalOrder = null;
      this.ui.drag = null;
      this.ui.drop = null;
      this.ui.isDragging = false;
    },
    taskDnDClass(list, task, index){
      try {
        const out = {};
        const drag = this.ui.drag;
        const drop = this.ui.drop;
        if (drag?.taskId === task.id) out.dragging = true;
        if (drop && drop.listId === list.id) {
          if (drop.index === index) out['drop-before'] = true;
          if (drop.index === index + 1) out['drop-after'] = true;
        }
        return out;
      } catch { return {}; }
    },
    onTaskRowClick(list, t){
      this.openItemView(list, t);
    },

    /* --- task completion --- */
    completeTask(list, task, ev) {
      if ((task?.type || 'task') === 'note') {
        this.openItemView(list, task);
        return;
      }
      if (this.isMilestone(task)) return;
      this.$set ? this.$set(this.ui.completing, task.id, true) : (this.ui.completing[task.id] = true);
      this.playSuccessSound();
      setTimeout(() => {
        this.finishTaskCompletion(list, task);
      }, 320);
    },
    finishTaskCompletion(list, task){
      try {
        this.pushUndo('completeTask');
        if (!this.history[list.id]) this.history[list.id] = [];
        this.history[list.id].unshift(this.buildHistoryEntry(task, 'completed'));
        list.tasks = (list.tasks||[]).filter(t=>t.id!==task.id);
        this.handleRuleCopyCompletion(task);
        delete this.ui.completing[task.id];
        this.ui.redoStack = [];
      } catch {}
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
  },
};
</script>

<style>
html, body, #app { height: 100%; margin: 0; }
</style>


