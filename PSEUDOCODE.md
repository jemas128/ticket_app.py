# Cinema Queue App - Pseudocode Documentation

This document describes the high-level logic and algorithms used in the **Cinema Queue Live** application.

## 1. Global Configuration
- **Themes**: Collection of 5 preset themes (Neon, Sunset, Ocean, Forest, Horror), each containing:
  - `id`: Unique identifier
  - `name`: Display name
  - `bg`: CSS Linear Gradient (4-stop colors)
  - `accent`: Primary accent color for buttons/glows
- **Data Lists**:
  - `Names`: Array of random customer names.
  - `Avatars`: Array of emoji avatars.
  - `Snacks`: Array of concession items (Popcorn, Soda, etc.).
  - `LoadingMessages`: Temporary strings displayed while AI generates text.

## 2. State Management
The application maintains the following state variables:
1.  **Queue**: List of `Ticket` objects (Currently waiting customers).
2.  **History**: List of `ServedCustomer` objects (Customers who have left the queue).
3.  **TicketID**: Integer counter (starts at 101) to ensure unique IDs.
4.  **Theme**: The currently selected active theme object.
5.  **VipMode**: Boolean flag to determine if the next user added is a VIP.

## 3. Core Algorithms

### 3.1 Enqueue (Adding a Customer)
When the "Add Customer" (or VIP) button is clicked:
1.  **Generate Data**: Pick a random Name, Avatar, and Snack from the global lists.
2.  **Capture Time**: Get current system time formatted as HH:MM AM/PM.
3.  **Create Object**:
    ```json
    {
      "id": Current TicketID,
      "name": RandomName,
      "avatar": RandomAvatar,
      "joined": CurrentTime,
      "snack": RandomSnack,
      "isVip": Current VipMode State
    }
    ```
4.  **Increment Counter**: Increase `TicketID` by 1.
5.  **Insert Logic**:
    - *IF* `VipMode` is TRUE **AND** `Queue` is not empty:
      - Insert the new Ticket at **Index 1** (Immediately behind the person currently being served).
    - *ELSE*:
      - Push the new Ticket to the **End** of the Queue array.
6.  **Reset Toggle**: Set `VipMode` back to `FALSE`.

### 3.2 Dequeue (Serving a Customer)
When the "Serve Next" button is clicked:
1.  **Validation**: IF Queue length is 0, STOP.
2.  **Snapshot**: Store the customer at `Queue[0]` (Head of line).
3.  **Optimistic UI Update**:
    - Remove `Queue[0]` from the Queue state immediately.
    - Pick a random `LoadingMessage`.
    - Create a `ServedCustomer` object with `isPending: true`.
    - Prepend this object to the `History` state (appears at top).
4.  **AI Generation (Background Process)**:
    - Construct Prompt: *"Generate a witty, very short (max 7 words) cinema welcome for [Name]. Context: Ordered [Snack]. Theme: [CurrentThemeName]."*
    - Call **Gemini API** (`models.generateContent`).
    - *ON SUCCESS*:
        - Update the specific item in `History` state matching the Customer ID.
        - Replace `message` with AI text.
        - Set `isPending` to `false`.

### 3.3 Reset
1.  Empty `Queue` array.
2.  Empty `History` array.
3.  Reset `TicketID` to 101.

## 4. UI Rendering Logic

### Background Layer
- Renders the CSS `linear-gradient` defined in `CurrentTheme`.
- Applies a CSS Keyframe Animation (`gradientBG`) that shifts the background position over 30 seconds to create a slow, fluid motion.

### Left Panel (Controls)
- **Theme Switcher**: Maps over `THEMES` object. Clicking a button updates `Theme` state.
- **VIP Toggle**: Toggles `VipMode` boolean. Changes button style to Gold/VIP when active.
- **Add Button**: Triggers `Enqueue`.
- **Serve Button**: Triggers `Dequeue`. Disabled if `Queue` is empty.
- **Stats**:
  - *In Line*: `Queue.length`
  - *Wait Time*: `(Queue.length - 1) * 2 minutes`. (Subtracts 1 because the first person is technically "being served").

### Center Panel (The Queue)
- **Empty State**: If `Queue` is empty, show "Lobby is Empty" graphic.
- **List Rendering**: Map through `Queue`.
  - **Item 0**: Styled as "Active" (Scaled up, glowing border, badge says "SERVING NOW").
  - **Item 1+**: Styled normally (Badge says "WAITING").
  - **VIP Items**: Additional Gold border and "VIP" badge.
  - **Animation**: CSS Keyframe `popIn` plays when a new component mounts.

### Right Panel (History)
- **List Rendering**: Map through `History`.
- **Animation**: CSS Keyframe `slideInLeft` plays on mount.
- **Pending State**: If `isPending` is true, the message text pulses opacity to indicate AI is "thinking".
