<template>
<div class="board">
    <div class="colum todo">
        <h2 class="column-header">To Do📝</h2>
        <draggable  
        :list="todoTasks"
        group="tasks"
        @change="ondragEnd"
        class="task-list">
        <div v-for="task in todoTasks" :key="task.id" class="card">
        <strong>{{ task.title }}</strong>
        <p>{{ task.description }}</p>
      </div>
        </draggable>
    </div> 

    <div class="colum progress">
        <h2 class="column-header">In Progress⚙️</h2>
        <draggable
         :list="inProgressTasks"
        group="tasks"
        @change="ondragEnd"
        class="task-list">
        <div v-for="task in inProgressTasks" :key="task.id" class="card">
        <strong>{{ task.title }}</strong>
        <p>{{ task.description }}</p>
      </div>
        </draggable>
    </div> 

    <div class="colum done">
        <h2 class="column-header">Done✅</h2>
        <draggable
            :list="doneTasks"
            group="tasks"
            @change="ondragEnd"
            class="task-list"
        >
        <div v-for="task in doneTasks" :key="task.id" class="card">
        <strong>{{ task.title }}</strong>
        <p>{{ task.description }}</p>
      </div>
        </draggable>
    </div> 

</div>
</template>

<script>
import { mapGetters,mapMutations } from 'vuex';
import draggable from 'vuedraggable';

export default {
    name: 'DashBoardPage',
    components: {
        draggable,
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
            'moveTask'
        ]),
        ondragEnd(event) {
            const movedTaskId = event.moved.element.id; 
            const column = event.to.closest('.column').classList[1];
            this.moveTask({ taskId: movedTaskId, newStatus:column });
        }
    }
};
</script>

<style scoped>

.board {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #f4f5f7;
  min-height: 100vh;
}


.column {
  flex: 1;
  background: #ebecf0;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.column-header {
  font-weight: bold;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 10px;
  color: #172b4d;
}

.card {
  background: white;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0 1px 2px rgba(9, 30, 66, 0.25);
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.1s ease;
}

.card:hover {
  box-shadow: 0 4px 8px rgba(9, 30, 66, 0.25);
  transform: translateY(-2px);
}

.card h4 {
  margin: 0 0 5px;
  font-size: 14px;
  color: #172b4d;
}

.card p {
  margin: 0;
  font-size: 13px;
  color: #5e6c84;
}

.todo .column-header {
  background: #deebff;
  color: #0747a6;
}

.progress .column-header {
  background: #fff0b3;
  color: #ff8b00;
}

.done .column-header {
  background: #e3fcef;
  color: #006644;
}
</style>