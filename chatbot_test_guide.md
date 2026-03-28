# AI Chatbot Testing Guide

## Prerequisites
- ✅ OpenAI API key configured in backend/.env.production
- ✅ Backend running (port 8035 in production)
- ✅ Database migrations applied (013_impact_leader_features.sql)
- ✅ User account with Impact Leader or Enterprise tier

## Manual Testing Steps

### 1. Test RBAC (Access Control)

**Test Free/Explorer Users:**
1. Log in with Explorer tier account
2. Look for chatbot icon (bottom right)
3. ✅ Should see LOCK icon (not message icon)
4. Click chatbot
5. ✅ Should see upgrade prompt
6. ✅ Input field should be disabled
7. ✅ "Upgrade" button should appear in header

**Test Impact Leader Users:**
1. Log in with Impact Leader account
2. ✅ Should see regular message icon
3. Click chatbot
4. ✅ Should see personalized welcome message
5. ✅ Should see suggested questions
6. ✅ Input field should be active

### 2. Test Multi-Tenancy

**Setup:**
1. Create Organization A with 2 events
2. Create Organization B with 3 events
3. Create Impact Leader user in each org

**Test:**
1. Log in as Org A user
2. Ask: "How many events do I have?"
3. ✅ Response should men3. ✅ Response should men3. ✅ Response shouser
5. Ask: "How many events do I have?"
6. ✅ Response should mention 3 events (NOT 5)

### 3. Test AI Integration

**Queries**Queries**Queries**Qu I reduce catering emissions?"
- "What are my biggest sources of emissions?"
- "How do my events compare to industry standards?"
- "Give me specific recommendations for my next event"

**Expec**Expec**Expec*
- ✅ Response within 2-5 seconds
- ✅ Respextual answers based on user's actual event data
- ✅ Mentions specific event names/dates if applicable
- ✅ Professional, sustainability-focused tone

### 4. Test Error Handling

**Invalid API Key:**
1. Set OPENAI_API_KEY to invalid value
2. Try to send message
3. ✅ Should show f3. ✅ Should show f3. . ✅ Should not crash or expose technica3. ✅ Sh


. ✅ Should show f3. �Disconnect back. ✅ Should show f3. �Disconnect baculd show "having trouble connecting" message

### 5. Test Conversation History### 5. Test Conve: "What is carbon offsetting?"
2. Wait for response
3. Send follow-up: "How much does it cost?"
4. ✅ AI should understand context f4. ✅ AI should understand context f4. ✅ AIrev4. ✅ AI should understaSuggested Questions

1. Open chatbot (fresh conversation)
2. ✅ 2. ✅ 2. ✅ 2. ✅ 2. ✅ 2. ✅ 2. ✅ 2.y suggested question
4. ✅ Should auto-send and get response
5. ✅ Suggested questions should disappear after first message

## API Testing (curl)

### Get Suggested Questions
```bash
curl -X GET https://ecobserve.com/api/impact-leader/chat/suggestions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    "Ho    "Ho    "Ho    "Ho    "Ho    "Ho  print?",
    "What are th    "What are th    "What are th    "What are th    "What are th    "What are th    "What arvents",
    "What funding opportunities are available for sustainable events?"
  ]
}
```

### Send Chat Message
```bash
curl curl curl curl curl curl curl curl curl curl curl curl curl curl curl curl curarer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
                                                                                                                                  json
{
  "success": true,
  "data": {
    "message": "Here are effective strategies to reduce catering emissions...",
    "timestamp": "2026-03-28T10:30:    "timestamp": "2026-03-28T10:30:    "timestamp": "2026-03-2sat    "timestamp": "20ELE    "timestamp": "2026-03-anization_id,
  conversation_data->>'messages' as messages,
  created_at
FROM chatbot_conversations
ORDER BY created_at DESC
LIMLI 5;
```

### Verify Multi-Tenancy
```sql
-- Should only return data for specific org
SELECT 
  COUNT(*) as total_events,
  SUM(total_carbon) as total_carbon
FROM events
WHERE organization_id = 1 
  AND deleted_at IS NULL;
```

## Perfor## Perfor## Perfor## Perfor## Perfor## Perfor## Perfor## Perfor## Per(GPT-4 latenc## Perfor## Perfor##00-1500 tokens per conversation
- Cost per message: ~$0.01-0.03 USD
- Database query time: <100ms
- Total API endpoint time: <5s

## Monitoring

**Check Backend Logs:**
```bash
# CapRover logs
# Look for:
✅ "Chatbot response generated"
✅ "OpenAI request successful"
⚠️ "OpenAI request failed" (troubleshoot)⚠️ "OppenAI API key not configured" (add key)
```

## Troubleshooting

**Issue: "AI Assistant requires Impact Leader tier"**
- Solution: Upgrade subscription or check tier in database

**Issue: "Failed to generate chatbot response"**
- Check: OpenAI A- Check: OpenAI A- Check: OpenAI A- Check: Ova- Check: Opet
- Check: Backend has internet access
- Check: OpenAI API sta- s (status.openai.com)

**Iss**IsShows other organization's data**
- CRITICAL: C- CRITWT middleware
- Verify: organizationId is extracted from token
- Verify: SQL queries use WHERE organization_id = $1

**Issue: Slow **sponses**
- Check: GPT-4 model (faster than GPT-4-turbo)
- Check: max_tokens setting (lower = faster)
- Check: Network latency to OpenAI

## Succe## Criteria

✅ Free users see upgr✅ Free users see upgr✅ Fer users can chat with AI  
✅ Users only see their organization's data �✅ Re✅ Users onlyntextual and relevant  
✅ Errors are handled gracefully  
✅ Conversation history persists  
✅ Token usage is logged  
✅ Performance meets benchmarks  

---

**Last Updated:** 2026-03-28  
**Implementation Status:** ✅ Production Ready
