<template>
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

    <div class="column progress">
        <div class="column-header">
        <span>In Progress</span>
        <span class="dots">...</span>
      </div>
        <draggable
         :list="inProgressTasks"
        group="tasks"
        @change="event => ondragEnd(event, 'progress')"
        class="task-list"
        >
        <div v-for="task in inProgressTasks" :key="task.id" @click="openTaskDetails(task)" class="card">
        <strong>{{ task.title }}</strong>
      </div>
        </draggable>
        <button class="add-task-btn"><span>+</span> Add Task</button>
    </div> 

    <div class="column done">
        <div class="column-header">
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
    },

    computed: {
        ...mapGetters ([
            'todoTasks',
            'inProgressTasks',
            'doneTasks'
            ]),
    },

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
      }
    }
};
</script>

<style scoped>

.board {
  display: flex;
  gap: 25px;
  padding: 40px;
  justify-content: center;
  background-color: #f4f5f7; 
  min-height: 80vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.column {
  width: 20%;
  max-height: 70vh;
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
  align-items: center;
  padding: 0 5px 20px 5px;
  font-weight: 500;
  color: #44546f;
  font-size: 16px;
}

.dots {
  color: #888;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
}

.card {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: grab;
  transition: transform 0.1s ease;
}

.card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
}

.card-title {
  font-size: 14px;
  color: #172b4d;
  font-weight: 400;
  display: block;
}

.task-list {
  flex-grow: 1;
  min-height: 20px;
  margin-bottom: 10px;
}

.add-task-btn {
  background: transparent;
  border: none;
  color: #44546f;
  padding: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
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
}
</style>