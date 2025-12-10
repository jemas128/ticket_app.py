# Algorithm Documentation

This document outlines the core algorithms and data structure manipulations used in the Cinema Queue application.

## 1. Data Structures

### The Queue (Priority-Modified List)
The queue is implemented as a standard Array, but functions as a modified Priority Queue.
- **Structure**: `Array<Ticket>`
- **Behavior**: First-In-First-Out (FIFO) for standard entries, with Priority Insertion for VIPs.

### The History (Stack)
The history is implemented as a Stack to show the most recently served customers at the top.
- **Structure**: `Array<ServedCustomer>`
- **Behavior**: Last-In-First-Out (LIFO) visual representation (New items are prepended).

---

## 2. Algorithms

### Algorithm 1: Priority Insertion (Enqueue)

This algorithm determines where a new customer enters the line based on their VIP status. It ensures that the person currently being served (Index 0) is never displaced, but VIPs cut in front of all other waiting customers.

**Input**: 
- `CurrentQueue`: Array of Tickets
- `NewTicket`: Object
- `VipMode`: Boolean

**Logic**:
1.  **Check Empty State**: 
    - IF `CurrentQueue` is Empty:
        - `CurrentQueue` $\leftarrow$ `[NewTicket]`
        - RETURN
2.  **Check VIP Status**:
    - IF `VipMode` is TRUE:
        - *Operation*: Insert at Index 1 (Second position).
        - *Logic*: `CurrentQueue.splice(1, 0, NewTicket)`
        - *Result*: The Head (Index 0) remains. `NewTicket` becomes Index 1. Previous Index 1 becomes Index 2.
    - ELSE (`VipMode` is FALSE):
        - *Operation*: Append to End.
        - *Logic*: `CurrentQueue.push(NewTicket)`
        - *Result*: Added to the back of the line.

**Time Complexity**: 
- Standard: $O(1)$
- VIP: $O(N)$ (Due to array shifting in JavaScript)

---

### Algorithm 2: Optimistic Dequeue with Async Resolution

This algorithm handles the removal of a customer and the generation of their exit message without blocking the UI. It utilizes an "Optimistic UI" pattern.

**Input**: 
- `Queue`: Array of Tickets
- `History`: Array of ServedCustomers

**Logic**:
1.  **Guard Clause**: IF `Queue` is Empty, RETURN.
2.  **Extraction**:
    - Let `Person` = `Queue[0]`
    - `Queue` $\leftarrow$ `Queue.slice(1)` (Remove Head)
3.  **Optimistic History Update**:
    - Generate `TempMessage` (Random placeholder from constant list).
    - Create `ServedObject` merged from `Person` + `TempMessage` + `{ isPending: TRUE }`.
    - `History` $\leftarrow$ `[ServedObject] + History` (Prepend).
4.  **Asynchronous Generation (Parallel Process)**:
    - Initiate AI Request (`GoogleGenAI`).
    - *Await Response*.
5.  **Reconciliation (State Update)**:
    - LOCATE `Item` in `History` where `Item.id` == `Person.id`.
    - UPDATE `Item.message` $\leftarrow$ AI Response Text.
    - UPDATE `Item.isPending` $\leftarrow$ FALSE.
    - Trigger Re-render.

**Complexity**: 
- Removal: $O(N)$ (Shift operation)
- History Search: $O(H)$ where H is history length.

---

### Algorithm 3: Wait Time Calculation

Calculates the estimated wait time for new users entering the queue.

**Logic**:
- IF `Queue.length` > 1:
    - `WaitCount` = `Queue.length` - 1
    - (We subtract 1 because Index 0 is "Active/Serving" and not waiting).
- ELSE:
    - `WaitCount` = 0
- `TotalMinutes` = `WaitCount` * 2

---

### Algorithm 4: Theme Engine (Style Injection)

Dynamically updates the application visual state based on configuration objects.

**Input**: `ThemeObject` { id, bg, accent }

**Logic**:
1.  **Interpolation**: Inject `ThemeObject` values into a Template Literal CSS string.
2.  **Variable Binding**:
    - `--accent-color`: Set to `ThemeObject.accent`.
    - `background`: Set to `ThemeObject.bg`.
3.  **DOM Update**: React re-renders the `<style>` tag in the Head/Body, triggering a browser repaint of the gradient and button colors.
