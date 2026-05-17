# Toggle

A two-state button that can be either on or off.

## Usage

### Basic

```vue
<script setup lang="ts">
import { Toggle } from '@vuest/core'
import { ref } from 'vue'

const pressed = ref(false)
</script>

<template>
  <Toggle.Root v-model:pressed="pressed">
    <Toggle.Trigger>
      <button>{{ pressed ? 'ON' : 'OFF' }}</button>
    </Toggle.Trigger>
  </Toggle.Root>
</template>
```

### With Loading State

```vue
<script setup lang="ts">
import { Toggle } from '@vuest/core'
import { ref } from 'vue'

const pressed = ref(false)
const loading = ref(false)

async function handleToggle(newPressed: boolean) {
  loading.value = true
  await saveToServer(newPressed)
  pressed.value = newPressed
  loading.value = false
}
</script>

<template>
  <Toggle.Root :pressed="pressed" :loading="loading" @update:pressed="handleToggle">
    <Toggle.Trigger>
      <button>{{ loading ? 'Saving...' : pressed ? 'ON' : 'OFF' }}</button>
    </Toggle.Trigger>
  </Toggle.Root>
</template>
```

### Using Slot Props

```vue
<template>
  <Toggle.Root>
    <template #default="{ pressed }">
      <Toggle.Trigger>
        <button>{{ pressed ? 'ON' : 'OFF' }}</button>
      </Toggle.Trigger>
    </template>
  </Toggle.Root>
</template>
```

## API

### Toggle.Root

Container component that manages toggle state.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pressed` | `boolean` | `false` | The controlled pressed state (v-model supported) |
| `loading` | `boolean` | `false` | When true, disables interaction and sets aria-busy |

#### Slot Props

| Prop | Type | Description |
|------|------|-------------|
| `pressed` | `boolean` | Current pressed state |

### Toggle.Trigger

The interactive element that toggles the pressed state. Injects aria attributes into its child element.

#### Injected Attributes

| Attribute | Description |
|-----------|-------------|
| `aria-pressed` | Reflects the current pressed state |
| `aria-busy` | Set to `"true"` when loading |
| `aria-disabled` | Set to `"true"` when loading |
