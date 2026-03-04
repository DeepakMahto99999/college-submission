# session controller 

## 1. getCurrentSession
# --> Role:
Popup authority sync.
# ---> What it does:
   Finds the latest session where status is ARMED or RUNNING
   Returns:
    focusLength
    session info (id, topic, status, startTime, invalidReason)
# Why it exists:
Your extension popup must never assume state.
When:
  Browser restarts
  Extension reloads
  User closes popup
  Network drops
Popup calls this endpoint to know:

Am I IDLE?
ARMED?
RUNNING?
INVALID?

# Without this:
 Timer desync
 State mismatch
 Ghost sessions
 This is your state authority endpoint.



### 2️. startSession
# ---> Role:
Create a new session in ARMED state.
# What it does:
* Validates topic
* Gets user focusLength
---> Creates session:
* status = ARMED
* startTime = null
* totalFocusSeconds = 0
* counters reset

# Why startTime is null:

Because session is NOT running yet.

You are waiting for:
AI to approve the first valid video.

Without ARMED state:
You would start timer blindly → defeats your product idea.

This endpoint only prepares session.
It does not start focus.





### 3️. videoEvent
# 🎯 Role:

This is the brain of your system.
This endpoint decides:
Is this video valid for the topic?

What it does:
Step-by-step:
1.Load session
2.Check session-level cache
3.Check global AI cache
4.If not found → call AI
5.Apply confidence rule
6.Save decision:
   inside session.validatedVideos
   inside AiCache
If decision = VALID and status = ARMED:
   status → RUNNING
   startTime → now

Why this is critical:
Without this:
  You can’t prevent fake productivity
  You can’t enforce topic relevance
  You can’t transition ARMED → RUNNING
This endpoint is the central control logic.
Everything flows through this.




### 4. heartbeatFocus
# --> Role:

Server-side time accumulation.
What it does:
  Accepts seconds from extension
  Adds to totalFocusSeconds
  Updates lastHeartbeatAt

Why it exists:
   Never trust client timer fully.
   Extension shows visual timer.
   Backend accumulates real time.

This prevents:
  User editing extension
  Fake timer hacks
  Manual completion abuse
Without this:
  You can’t verify completion correctly.  



### 5. completeSession
# ---> Role:
Server-authorized completion.

What it does:
 1.Ensure session is RUNNING
 2.Check:

   totalFocusSeconds >= focusLength * 60

 3.If valid:
   status = COMPLETED
   completed = true

 4.Update user stats
 5.Unlock achievements

Why this must be server-side:
 Extension must never self-complete.

 If extension completes locally:
 User can modify extension code and fake sessions.

Server decides completion.
Always.




### 6️. resetSession
# ---> 🎯 Role:
Manual session invalidation.

What it does:
  status = INVALID
  invalidReason = MANUAL_RESET
  completed = false
  activeVideoId = null

Why it exists:
User may:
  Want to restart
  Realize wrong topic
  Abort intentionally

This cleanly kills session.

Without reset:
You would have orphan sessions.  


# User flow:
1.Popup → getCurrentSession
2.User enters topic → startSession
3.User clicks video → videoEvent
4.AI approves → status becomes RUNNING
5.Extension sends heartbeats → heartbeatFocus
6.Timer ends → completeSession
7.Or user resets → resetSession