<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <h2 class="title">{{ title }}</h2>
      <p class="message">{{ message }}</p>

      <div class="actions">
        <button class="btn cancel" @click="$emit('close')">
          {{ cancelText }}
        </button>
        <button class="btn confirm" @click="$emit('confirm')">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseConfirmModal",
  props: {
    title: {
      type: String,
      default: "Confirm Action"
    },
    message: {
      type: String,
      default: "Are you sure you want to continue?"
    },
    confirmText: {
      type: String,
      default: "Confirm"
    },
    cancelText: {
      type: String,
      default: "Cancel"
    }
  }
};
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  backdrop-filter: blur(6px);
}

.modal {
  width: 100%;
  max-width: 26rem;
  background: white;
  border-radius: 1.25rem;
  padding: 1.5rem;
  box-shadow: 0 1.5rem 3rem rgba(0, 0, 0, 0.18);
  text-align: center;
}

.title {
  margin: 0 0 0.75rem;
  font-size: 1.4rem;
  color: #1f2a44;
}

.message {
  margin: 0 0 1.5rem;
  color: #5b6475;
  line-height: 1.5;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.btn {
  min-width: 7rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.18s ease;
}

.cancel {
  background: #eef2f7;
  color: #334155;
}

.cancel:hover {
  background: #e2e8f0;
}

.confirm {
  background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.confirm:hover {
  transform: translateY(-1px);
}
</style>