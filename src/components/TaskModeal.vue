<template>
    <div class="modal-overlay">
        <div class="modal">
           <button class="delete-icon" @click="$emit('delete', task.id)">
            🗑
           </button>
           <h2 v-if="!isEditing">Task Details</h2>
            <h2 v-else>Edit Task</h2>
            <div v-if="!isEditing">

                    <p><strong>Title:</strong> {{ task.title }}</p>

                    <p><strong>Description:</strong></p>
                    <p>{{ task.description }}</p>

                    <p><strong>Status:</strong> {{ task.status }}</p>

                    <div class="buttons">
                        <button @click="startEdit">Edit</button>
                        <button @click="$emit('close')">Close</button>
                    </div>

            </div>
            <div v-else>

            <label>Title</label>
            <input v-model="editableTask.title">

            <label>Description</label>
            <textarea v-model="editableTask.description"></textarea>

            <div class="row">

                <!-- <div class="field">
                <label>Assigned To</label>
                <select>
                    <option>{{ currentUser.name }}</option>
                </select>
                </div> -->

                <div class="field">
                <label>Status</label>
                <select v-model="editableTask.status">
                    <option value="todo">To Do</option>
                    <option value="progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
                </div>

            </div>

            <div class="buttons">
                <button class="cancel" @click="cancelEdit">Cancel</button>
                <button class="save" @click="save">Save Task</button>
            </div>

            </div>

  </div>

</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'TaskModal',
    props: {
        task: Object,
    },
    data() {
        return {
            isEditing: false,
            editableTask: {},
        };
    },

    computed: {
        ...mapGetters(['currentUser']),
    },

    watch: {
        task(newTask) {
            this.editableTask = { ...newTask };
            this.isEditing = false;
        },
    },

    methods: {
        startEdit() {
            this.isEditing = true;
            this.editableTask = { ...this.task };
        },
        cancelEdit() {
            this.isEditing = false;
            this.editableTask = {};
        },
        save() {
            this.$emit('save', this.editableTask);
            this.isEditing = false;
        },
    },
};
</script>

<style scoped>

.modal-overlay{
    position: fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background: rgba(0,0,0,0.45);
    display:flex;
    align-items:center;
    justify-content:center;
    backdrop-filter: blur(3px);
}

.modal{
    position: relative;
    background: white;
    width: 520px;
    max-width: 90%;
    border-radius: 14px;
    padding: 28px;
    box-shadow: 0 25px 50px rgba(0,0,0,0.18);
    animation: modalOpen 0.18s ease;
}

.delete-icon{
    position: absolute;
    top: 12px;
    right: 12px;
    background: transparent;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #9ca3af;
    transition: 0.15s;
}

.delete-icon:hover{
    color: #ef4444;
    transform: scale(1.15);
}

h2{
    text-align:center;
    margin-bottom:20px;
    font-weight:600;
    color:#1f2937;
}

label{
    display:block;
    margin-top:14px;
    font-size:13px;
    font-weight:600;
    color:#4b5563;
}

input,
textarea,
select{
    width:100%;
    padding:11px 12px;
    border-radius:8px;
    border:1px solid #d1d5db;
    background:#f3f4f6;
    margin-top:6px;
    font-size:14px;
    transition: all 0.15s ease;
}

input:focus,
textarea:focus,
select:focus{
    outline:none;
    border-color:#4c7cf3;
    background:#eef2ff;
}

textarea{
    min-height:70px;
    resize:none;
}

.row{
    display:flex;
    gap:16px;
    margin-top:6px;
}

.field{
    flex:1;
}

/* כפתורים */
.buttons{
    display:flex;
    justify-content:flex-end;
    gap:10px;
    margin-top:26px;
}

button{
    padding:9px 18px;
    border:none;
    border-radius:8px;
    font-size:14px;
    cursor:pointer;
    transition:0.15s;
}

/* כפתור שמירה */
.save{
    background:#4c7cf3;
    color:white;
}

.save:hover{
    background:#3b67d8;
}

.cancel{
    background:#e5e7eb;
    color:#374151;
}

.cancel:hover{
    background:#d1d5db;
}

@keyframes modalOpen{
    from{
        transform: scale(0.92);
        opacity:0;
    }
    to{
        transform: scale(1);
        opacity:1;
    }
}

</style>