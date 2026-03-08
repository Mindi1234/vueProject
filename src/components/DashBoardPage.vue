<template>
<<<<<<< HEAD
<div class="board">
    <div class="column todo">
        <div class="column-header">
        <span>To Do</span>
        <span class="dots">...</span>
      </div>
        <draggable  
        :list="todoTasks"
        group="tasks"
        @change="event => ondragEnd(event, 'todo')"
        class="task-list"
        >
        <div v-for="task in todoTasks" :key="task.id" @click="openTaskDetails(task)" class="card">
        <strong>{{ task.title }}</strong>
      </div>
        </draggable>
        <button class="add-task-btn"><span>+</span> Add Task</button>
    </div> 
=======
  <div>
    <!-- Top Bar -->
    <div class="topbar">
      <div class="logo">gira</div>
>>>>>>> 5682eb57cc3878e83083aa89843d86031b1ee273

      <input class="search" v-model="search" placeholder="Search tasks..." />

      <button class="add-main-btn" @click="showAddModal = true">+ Add Task</button>

      <div class="avatar">M</div>
    </div>

    <!-- Board -->
    <div class="board">
      <!-- TODO -->
      <div class="column todo">
        <div class="column-header">
          <span>To Do ({{ todoTasks.length }})</span>
          <span class="dots">...</span>
        </div>

        <draggable
          :list="todoTasks"
          group="tasks"
          @change="(event) => ondragEnd(event, 'todo')"
          class="task-list"
        >
<<<<<<< HEAD
        <div v-for="task in inProgressTasks" :key="task.id" @click="openTaskDetails(task)" class="card">
        <strong>{{ task.title }}</strong>
      </div>
=======
          <div v-for="task in filteredTodo" :key="task.id" class="card">
            <strong>{{ task.title }}</strong>
          </div>
>>>>>>> 5682eb57cc3878e83083aa89843d86031b1ee273
        </draggable>

        <button class="add-task-btn" @click="showAddModal = true">
          <span>+</span> Add Task
        </button>
      </div>

      <!-- PROGRESS -->
      <div class="column progress">
        <div class="column-header">
<<<<<<< HEAD
        <span>Done</span>
        <span class="dots">...</span>
      </div>
        <draggable
            :list="doneTasks"
            group="tasks"
            @change="event => ondragEnd(event, 'done')"
            class="task-list"
        >
        <div v-for="task in doneTasks" :key="task.id" @click="openTaskDetails(task)" class="card">
        <strong>{{ task.title }}</strong>
      </div>
        </draggable>
        <button class="add-task-btn"><span>+</span> Add Task</button>
    </div> 

    <TaskModal
        v-if="showModal"
        :task="selectedTask"
        @close="closeModal"
        @save="saveTask"
    />

</div>
</template>

<script>
import { mapGetters,mapMutations } from 'vuex';
import draggable from 'vuedraggable';
import TaskModal from './TaskModeal.vue';

export default {
    name: 'DashBoardPage',
    components: {
        draggable,
        TaskModal
    },

    data() {
        return {
            selectedTask: null,
            showModal: false
        };
=======
          <span>In Progress ({{ inProgressTasks.length }})</span>
          <span class="dots">...</span>
        </div>

        <draggable
          :list="inProgressTasks"
          group="tasks"
          @change="(event) => ondragEnd(event, 'progress')"
          class="task-list"
        >
          <div v-for="task in filteredProgress" :key="task.id" class="card">
            <strong>{{ task.title }}</strong>
          </div>
        </draggable>

        <button class="add-task-btn" @click="showAddModal = true">
          <span>+</span> Add Task
        </button>
      </div>

      <!-- DONE -->
      <div class="column done">
        <div class="column-header">
          <span>Done ({{ doneTasks.length }})</span>
          <span class="dots">...</span>
        </div>

        <draggable
          :list="doneTasks"
          group="tasks"
          @change="(event) => ondragEnd(event, 'done')"
          class="task-list"
        >
          <div v-for="task in filteredDone" :key="task.id" class="card">
            <strong>{{ task.title }}</strong>
          </div>
        </draggable>

        <button class="add-task-btn" @click="showAddModal = true">
          <span>+</span> Add Task
        </button>
      </div>
    </div>

    <!-- Add Task Modal -->
    <AddTaskModal
      v-if="showAddModal"
      @close="showAddModal = false"
      @create="handleCreateTask"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import draggable from "vuedraggable";
import AddTaskModal from "./AddTaskModal.vue";

export default {
  name: "DashBoardPage",
  components: { draggable, AddTaskModal },

  data() {
    return {
      showAddModal: false,
      search: ""
    };
  },

  computed: {
    ...mapGetters(["todoTasks", "inProgressTasks", "doneTasks"]),

    filteredTodo() {
      return this.todoTasks.filter((t) =>
        (t.title || "").toLowerCase().includes(this.search.toLowerCase())
      );
    },
    filteredProgress() {
      return this.inProgressTasks.filter((t) =>
        (t.title || "").toLowerCase().includes(this.search.toLowerCase())
      );
    },
    filteredDone() {
      return this.doneTasks.filter((t) =>
        (t.title || "").toLowerCase().includes(this.search.toLowerCase())
      );
    }
  },

  methods: {
    ...mapMutations(["moveTask", "addTask"]),

    handleCreateTask(newTask) {
      this.addTask(newTask);
      this.showAddModal = false;
>>>>>>> 5682eb57cc3878e83083aa89843d86031b1ee273
    },

    ondragEnd(event, newStatus) {
      if (event.added) {
        const task = event.added.element;

<<<<<<< HEAD
    methods: {
        ...mapMutations([
            'moveTask',
            'updateTask'
        ]),
       ondragEnd(event, newStatus) {
        if (event.added) {
          const task = event.added.element;
          
          console.log(`Moving task ${task.id} to ${newStatus}`);
          
          this.moveTask({ 
            taskId: task.id, 
            newStatus: newStatus 
          });
        }
      },

      openTaskDetails(task) {
        this.selectedTask = { ...task };
        this.showModal = true;
      },

      closeModal() {
        this.showModal = false;
      },

      saveTask(updatedTask) {
        this.updateTask(updatedTask)
         this.showModal = false;
=======
        // map middle column key to your store status
        const mapped = newStatus === "progress" ? "progress" : newStatus;

        this.moveTask({
          taskId: task.id,
          newStatus: mapped
        });
>>>>>>> 5682eb57cc3878e83083aa89843d86031b1ee273
      }
    }
  }
};
</script>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 40px;
  background: white;
  border-bottom: 1px solid #e6e6e6;
}

.logo {
  font-size: 22px;
  font-weight: 700;
}

.search {
  width: 300px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.add-main-btn {
  margin-left: auto;
  background: #1f6feb;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.board {
  display: flex;
  gap: 25px;
  padding: 40px;
  justify-content: center;
  background-color: #f4f5f7;
  min-height: 80vh;
}

.column {
  width: 20%;
  padding: 20px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
}

.todo {
  background-color: #dce6f2;
}
.progress {
  background-color: #ffebd2;
}
.done {
  background-color: #e2ede4;
}

.column-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
  font-weight: 500;
  color: #44546f;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 12px;
  cursor: grab;
}

.add-task-btn {
  background: transparent;
  border: none;
  padding: 12px;
  cursor: pointer;
  font-weight: 500;
<<<<<<< HEAD
  display: block;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin-top: auto;
  border-radius: 8px;
  transition: background 0.2s;
}

.add-task-btn span {
  font-size: 18px;
}

.add-task-btn[data-v-38e19cba]:hover {
  background-color: #091e420f;
  color: #172b4d;
=======
}

.add-task-btn:hover {
  background: rgba(255, 255, 255, 0.5);
>>>>>>> 5682eb57cc3878e83083aa89843d86031b1ee273
}
</style>