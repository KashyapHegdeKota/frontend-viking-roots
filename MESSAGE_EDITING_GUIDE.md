# Message Editing Feature - Walkthrough

## Overview
The message editing feature allows users to modify their previous responses and get new AI responses based on the edited message. When a message is edited, all subsequent messages are removed, and the conversation continues from that point with the new message.

## How It Works

### 1. **State Management**
Three new state variables were added:

```typescript
const [editingIndex, setEditingIndex] = useState<number | null>(null);
const [editedContent, setEditedContent] = useState('');
```

- **`editingIndex`**: Tracks which message (by index) is currently being edited. `null` means no message is being edited.
- **`editedContent`**: Stores the temporary edited text while the user is modifying it.

### 2. **Core Functions**

#### **`startEdit(index, content)`**
- Called when user clicks the "Edit" button on a message
- Sets `editingIndex` to the clicked message's index
- Loads the current message content into `editedContent`
- Switches the UI to edit mode for that message

#### **`cancelEdit()`**
- Called when user clicks "Cancel" while editing
- Resets `editingIndex` back to `null`
- Clears `editedContent`
- Returns to view mode without making changes

#### **`saveEdit(index)`**
- Called when user clicks "Save & Resend"
- **Removes all messages from the edited position onwards** (this is the key behavior)
- Creates a new message with the edited content
- Sends the edited message to the backend API
- Gets a new AI response based on the edited message
- Updates the conversation with the new flow

### 3. **UI Components**

#### **View Mode** (default state)
- Displays the message content in a bubble
- Shows an "✏️ Edit" button below user messages
- Edit button only appears for user messages (not AI messages)
- Edit button is hidden when loading

#### **Edit Mode** (when editing)
- Replaces the message bubble with a `<textarea>`
- Shows two buttons:
  - **"Save & Resend"**: Commits the changes and gets new AI response
  - **"Cancel"**: Discards changes and returns to view mode
- The textarea is auto-focused for immediate editing
- The textarea uses the same styling as the rest of the interface

### 4. **User Flow Example**

Let's say you have this conversation:

```
1. AI: "What's your name?"
2. User: "John"           ← You want to edit this
3. AI: "Nice to meet you, John! Where are you from?"
4. User: "New York"
5. AI: "Great! Tell me about New York..."
```

**When you edit message #2:**

1. Click "✏️ Edit" on message #2
2. Change "John" to "Sarah"
3. Click "Save & Resend"
4. **Messages #3, #4, and #5 are deleted** (everything after your edit)
5. New conversation becomes:

```
1. AI: "What's your name?"
2. User: "Sarah"          ← Your edited message
3. AI: "Nice to meet you, Sarah! Where are you from?"  ← New AI response
```

Now the conversation continues from this point with the edited context.

### 5. **Backend Integration**

When saving an edit:

```javascript
const response = await fetch(API_ENDPOINTS.MESSAGE, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: editedContent,           // The edited message text
    chat_history: newMessages         // History UP TO the edited message
  }),
});
```

The backend receives:
- The edited message content
- The chat history **only up to (and including) the edited message**
- It generates a new response based on this modified context

### 6. **Key Features**

✅ **Edit any user message** - Click edit button on any of your responses
✅ **Live preview** - See your changes in the textarea as you type
✅ **Context preservation** - Messages before the edit are kept
✅ **Conversation branching** - Messages after the edit are removed (creating a new branch)
✅ **Loading states** - Edit buttons disabled while waiting for AI response
✅ **Error handling** - Alerts user if resend fails
✅ **Cancel option** - Discard changes if you change your mind

### 7. **Visual Feedback**

- Edit button appears in subtle gray (#666) and turns black on hover
- Textarea has a distinct border (2px solid #111) to show edit mode
- Buttons follow the same design system as the rest of the app
- Loading states prevent multiple edits simultaneously

### 8. **Edge Cases Handled**

- ✅ Can't save empty messages (button is disabled)
- ✅ Can't edit while AI is responding (edit buttons hidden)
- ✅ Can't click multiple edit buttons at once (only one edit mode at a time)
- ✅ Edit mode is cancelled automatically when save is clicked
- ✅ Scroll position maintained after edits

## Usage Instructions

1. **To edit a message:**
   - Click the "✏️ Edit" button below any of your messages
   
2. **To save and continue:**
   - Modify the text in the textarea
   - Click "Save & Resend"
   - Wait for the new AI response
   
3. **To cancel:**
   - Click "Cancel" to discard changes

## Customization Options

You can customize the behavior by modifying:

- **Edit button style**: Change the hover colors, font size, or icon
- **Textarea appearance**: Adjust border color, padding, or min-height
- **Button labels**: Change "Save & Resend" to something else
- **Confirmation dialogs**: Add a confirmation before deleting subsequent messages
- **Undo feature**: Store previous conversation states to allow undo

## Technical Notes

- Messages are stored in an array with indices 0, 1, 2, etc.
- `slice(0, index)` gets all messages BEFORE the edited message
- The edited message is then appended to create the new history
- React re-renders the component when `messages` state changes
- The `key={index}` prop helps React efficiently update the message list
