/* Assistant design and illustrative scenarios from steiner-redesign-v2.html. */
window.initSteinerAssistant = function(root) {
  if (!root) return function() {};
  const events = new AbortController();
  const byId = id => root.querySelector('#' + id);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches, focused = false, visible = false;
  let lastExample = 0;
  let progressAnimation, contentAnimations = [], measuring = false, layoutWidth = 0;
  function animateContent() {
    if (measuring) return;
    contentAnimations.forEach(a => a.cancel());
    contentAnimations = [];
    if (reduced.matches) return;
    const reveal = (el, delay, duration = 240) => {
      contentAnimations.push(el.animate(
        [{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],
        {duration,delay,easing:'cubic-bezier(.2,.7,.2,1)',fill:'both'}
      ));
    };
    reveal(root.querySelector('.bubble.user'), 0, 180);
    reveal(root.querySelector('.bubble.steiner'), 100, 260);
    root.querySelectorAll('.run-steps li').forEach((el,i) => reveal(el, 220 + i*110));
    reveal(byId('result'), 680, 280);
  }
const helper=(label,user,agent,steps,result,code,options={})=>({label,user,agent,steps,result,code,attachment:options.attachment||'',agentNote:options.agentNote||'',resultTitle:options.resultTitle||'',statusType:options.type||'verified',state:options.state||'EVIDENCE CAPTURED',footer:options.footer||['SCOPED','SAME ENGAGEMENT','RETEST HISTORY'],source:options.source||'',role:options.role||'STEINER · EXECUTION UPDATE',hint:options.hint||'Operator-approved tests stay within scope. Findings require independent evidence before reporting.'});
const scenarios={
off:[
helper('Run every release','Run deterministic security tests against staging on every deploy.','Engine-only scan profile ready. Reuse existing authenticated sessions, test covered surfaces and validate only reproducible findings.',['✓ Deployment trigger registered','✓ Authenticated routes queued for discovery','✓ Native attack modules selected','✓ Proof checks and reports attached'],'READY · AI OFF','profile=ai_off  •  trigger=deploy  •  model_calls=0',{attachment:'target: staging.example.com  ·  schedule: on_deploy',type:'pending',state:'SCHEDULE PREPARED',role:'ENGINE · CONFIGURATION',source:'RELEASE SCAN / ENGINE ONLY',resultTitle:'Release scan configured',hint:'No agent calls are needed for this mode. The deterministic engine runs the configured test plan.'}),
helper('Retest a patched finding','Retest the IDOR found in the last release. No new full scan.','The existing proof was replayed under Alice and Bob. Bob no longer receives Alice’s export.',['✓ Finding ST-042 selected','✓ Original request + identities restored','✓ Replayed as Bob → 403 denied','✓ Evidence and history updated'],'FIX VERIFIED','GET /api/exports/7731 as Bob → 403',{attachment:'finding: ST-042  ·  revision: release-42',type:'verified',resultTitle:'ST-042 · Access control fixed',state:'RETEST COMPLETE',role:'ENGINE · RETEST RESULT',source:'RETEST / REPLAY',hint:'The same saved exploit is retried against the fixed release; no AI is required.'}),
helper('Compare two releases','Show what changed between the previous scan and this release.','The engine compared the two run records. One previously proven weakness is now fixed; no new proof emerged from this illustration.',['✓ Load previous baseline','✓ Run same scoped tests on current build','✓ Compare finding evidence across runs','✓ Link retest results to finding history'],'DIFF READY','Release 41: 1 open  →  Release 42: 0 open',{attachment:'releases: 41 → 42',type:'verified',resultTitle:'Release-to-release comparison',source:'BASELINE / DELTA',role:'ENGINE · COMPARISON',hint:'Run-to-run changes remain linked to their original finding history.'})],
on:[
helper('Investigate the hard leads','Investigate promising authorization paths, with a fixed AI budget.','The engine collected signals. AI ranked suspicious routes, then sent the most promising path back to the validation engine.',['✓ In-scope endpoints and roles enumerated','✓ High-signal auth paths shortlisted','✓ Reasoning budget checked before each step','✓ Deterministic replay queued for chosen path'],'PLAN · VALIDATION','budget_cap=operator_set  •  confirm=engine_only',{attachment:'target: /api/*  ·  identities: Alice, Bob',type:'pending',state:'INVESTIGATION PREPARED',role:'AI INVESTIGATION · PREVIEW',source:'AI-ASSISTED / AUTH PATHS',resultTitle:'Reasoning-guided investigation',hint:'AI suggests the next branch; only a reproducible engine test can confirm a finding.'}),
helper('Reason over a GraphQL API','Explore this GraphQL API for cross-role authorization gaps.','The assistant selected query and mutation paths worth cross-role comparison. The engine will replay candidate operations.',['✓ GraphQL schema or captured operations loaded','✓ Role-sensitive operations identified','✓ AI proposed test variants under cap','✓ Cross-identity replay required for finding'],'PLAN · VALIDATION','surface=graphql  •  role_pair=alice,bob',{attachment:'endpoint: /graphql  ·  identities: Alice, Bob',type:'pending',role:'AI INVESTIGATION · PREVIEW',source:'AI-ASSISTED / GRAPHQL',resultTitle:'GraphQL test plan',hint:'Proposed attacks must pass independent replay and authorization controls.'}),
helper('Control the model budget','Use AI for reasoning, but stop after my budget is reached.','A hard model budget is part of the execution profile. The deterministic engine can continue covered checks without model spend.',['✓ Scope stays unchanged','✓ Per-run model budget set','✓ Exhaustion behavior selected','✓ Proof and retest remain engine-owned'],'BUDGET SET','AI budget: 120 credits  •  overflow: stop_agent',{attachment:'profile: ai_on  ·  cap: operator selected',type:'info',role:'STEINER · EXECUTION SETTINGS',source:'AI BUDGET / CONTROLS',resultTitle:'Operator-controlled AI spend',state:'CONFIGURATION READY',hint:'The operator chooses where model reasoning is allowed and how much it may spend.'})],
swarm:[
helper('Assess the full application','Coordinate web, API, and authentication specialists for this scoped test.','Planned swarm workflow: specialists divide surfaces and hand their evidence to a shared finding queue.',['○ Web specialist explores browser routes','○ API specialist examines operation patterns','○ Auth specialist compares identities','○ Common engine validates and deduplicates proofs'],'DESIGN · PLANNED','specialists=web,api,auth  •  scope=staging',{attachment:'scope: staging.example.com  ·  cap: configured',type:'info',state:'TARGET-STATE PREVIEW',role:'AGENT SWARM · PLANNED',source:'SWARM / COORDINATION',resultTitle:'Specialist coordination',hint:'Agent swarm is a target-state experience. Do not present it as shipped without release acceptance.'}),
helper('Review agent handoffs','Show where specialists found overlapping or related leads.','Planned combined view: one lead can pass between specialists while the finding history stays consistent.',['○ Web agent discovers an export workflow','○ Auth agent checks cross-account access','○ API agent confirms endpoint context','○ Engine runs a reproducible final check'],'DESIGN · PLANNED','lead_id=C-28  •  evidence_owner=engine',{attachment:'engagement: 12  ·  candidate: C-28',type:'info',state:'TARGET-STATE PREVIEW',role:'SWARM · PLANNED HANDOFF',source:'SWARM / SHARED CONTEXT',resultTitle:'Unified candidate review',hint:'The planned workflow avoids separately reported, unverified agent opinions.'})],
focused:[
helper('Test only access control','Run only access-control checks on /api/exports with Alice and Bob.','Focused request selection is prepared. No full assessment is needed; this is limited to the access-control module and matching routes.',['✓ Select access-control module','✓ Restrict to /api/exports/*','✓ Check owner and alternate identities','✓ Require consistent cross-role proof'],'FOCUSED · VALIDATION','module=authorization  •  route=/api/exports/*',{attachment:'request: GET /api/exports/7731',type:'pending',state:'SCOPED TEST PLAN',role:'FOCUSED TEST · PREVIEW',source:'FOCUSED / IDOR',resultTitle:'Access-control test prepared',hint:'Focused module execution is still subject to implementation acceptance.'}),
helper('Test this SQLi hunch','I think sort is injectable on this one request. Can you check?','A scoped SQLi validation plan uses control requests and repeated measurements. It does not infer exploitation from one error string.',['✓ Request and session captured','✓ Baseline and control requests prepared','✓ Time-differential checks queued','✓ Repeatability threshold enforced'],'FOCUSED · VALIDATION','GET /api/reports?sort=date  ·  check=SQLi',{attachment:'GET /api/reports?sort=date',type:'pending',state:'SCOPED TEST PLAN',role:'FOCUSED TEST · PREVIEW',source:'FOCUSED / SQLI',resultTitle:'Request-level SQLi test',hint:'A reproducible response or effect is required before reporting an injection vulnerability.'}),
helper('Inspect this JWT','Check whether this specific JWT can be forged.','The test examines allowed signature and claim mutations against an authorized endpoint. No finding is reported if all attempts are rejected.',['✓ Token format and algorithm inspected','✓ Applicable test cases selected','✓ Mutations checked against a protected route','✓ Rejections retained as test evidence'],'NOT PROVEN','4 attempts  •  0 accepted  •  no finding',{attachment:'Authorization: Bearer eyJ…',type:'info',state:'ILLUSTRATIVE NEGATIVE',role:'FOCUSED TEST · EXAMPLE',source:'FOCUSED / JWT',resultTitle:'No exploitable JWT issue shown',hint:'Negative test results are tracked, but are not reported as vulnerabilities.'})],
partner:[
helper('Set up authenticated testing','Set up an authenticated staging scan with Alice and Bob.','I prepared the target, identity profiles and session health checks. You can review the scope before launching the test.',['✓ Staging target and scope loaded','✓ Alice + Bob sessions attached','✓ Identity renewal checks configured','✓ Launch action prepared for approval'],'READY TO REVIEW','scope=staging  •  identities=alice,bob',{attachment:'target: staging.example.com  ·  Alice + Bob',type:'pending',state:'PREPARED ACTION',role:'STEINER · SETUP ASSISTANT',source:'PARTNER / SETUP',resultTitle:'Authenticated scan prepared',hint:'The partner helps configure the product; operator approval and access policies remain in control.'}),
helper('Check one authorization path','Can Bob read Alice’s exports? Only test /api/exports.','I’ll restrict the investigation to the exports surface and compare requests across Alice, Bob and the anonymous control.',['✓ /api/exports/* added to scope','✓ Captured owner request as Alice','✓ Anonymous control → 401','✓ Bob request → 200 / owner Alice'],'PROVEN · HIGH','GET /api/exports/7731 as Bob → 200',{attachment:'GET /api/exports/7731  ·  owner: alice',type:'verified',state:'PROVEN FINDING',role:'STEINER · FINDING SUMMARY',source:'PARTNER / FOCUSED INVESTIGATION',resultTitle:'ST-042 · Broken access control',hint:'The assistant navigates the test; the engine records independent evidence for the finding.'}),
helper('Investigate a SQLi hunch','I suspect SQL injection in this sort parameter. Try to prove it.','The engine tested variants against a baseline and control input. The timing differential reproduced across three controlled runs.',['✓ Parameter and session preserved','✓ Baseline 0.21s · control 0.24s','✓ True condition 5.01s','✓ Replayed 3/3 and attached request trace'],'PROVEN · HIGH','sort=date,…pg_sleep(5) → 5.01s vs 0.21s',{attachment:'GET /api/reports?sort=date',type:'verified',state:'PROVEN FINDING',role:'STEINER · FINDING SUMMARY',source:'PARTNER / SQL INJECTION',resultTitle:'ST-037 · SQL injection',hint:'Illustrative response timing is not a real scan result; proof must be reproduced in an authorized environment.'}),
helper('Explain why this is proven','Why does Steiner call finding ST-042 proven? Show me the evidence.','Alice owns export 7731. Anonymous access is correctly denied, but Bob receives Alice’s export. Replayed three times with both sessions held.',['✓ Expected identity boundary documented','✓ Alice: 200 / Anonymous: 401','✓ Bob: 200 with Alice-owned data','✓ Replay trace 3/3 linked to ST-042'],'EXPLAINED · PROOF','owner=alice  •  requester=bob  •  HTTP 200',{attachment:'finding: ST-042  ·  access control',type:'verified',state:'EVIDENCE EXPLAINED',role:'STEINER · ANALYST EXPLANATION',source:'PARTNER / EXPLAIN',resultTitle:'Why this is a real IDOR',hint:'The answer is grounded in the finding’s actual trace rather than just a model opinion.'}),
helper('Troubleshoot a failed retest','We patched ST-042. Why is the retest still failing?','The previous exploit still succeeds on the new deployment. I compared the request and identity context from both cycles; the authorization boundary is unchanged.',['✓ Original proof loaded','✓ Fixed build retested as Bob','✓ Bob still receives 200 / Alice data','✓ Finding remains OPEN · trace compared'],'STILL OPEN','release=42  •  Bob → 200  •  same owner data',{attachment:'finding ST-042  ·  release 42',type:'verified',state:'REGRESSION INVESTIGATION',role:'STEINER · RETEST EXPLANATION',source:'PARTNER / TROUBLESHOOT',resultTitle:'Fix did not close the weakness',hint:'Retest and investigation use the original proof and finding history, not a fresh unlinked alert.'}),
helper('Drive the UI by voice','Voice command: “Open the finding and show the replay.”','The assistant prepares a workspace navigation action and opens the linked evidence record in the illustrative interface.',['✓ Voice intent interpreted','✓ Finding ST-042 resolved in workspace','✓ Replay record located','✓ Evidence view action prepared'],'VOICE ACTION · PREVIEW','action=open_replay  •  finding=ST-042',{attachment:'spoken workflow illustration',type:'info',state:'WORKSPACE ACTION',role:'STEINER · VOICE ACTION',source:'PARTNER / VOICE NAVIGATION',resultTitle:'Voice-driven evidence navigation',hint:'Voice is an interface for the hacker partner, not a separate pentesting mode.'})]
};
const modes={off:['AI-OFF RELEASE SCAN','RUN CONFIGURATION','ENGINE · AI DISABLED'],on:['AI-ASSISTED SCAN','INVESTIGATION CHAT','AI ON · CAP ENFORCED'],swarm:['AGENT SWARM','COORDINATION PREVIEW','PLANNED · NOT GA'],focused:['FOCUSED TEST','TEST BRIEF','TARGETED TEST · VALIDATION'],partner:['HACKER PARTNER','CONVERSATION','CHAT OR VOICE']};let currentMode='partner',currentExample=0;const voiceCommands=['“Set up an authenticated scan with Alice and Bob.”','“Check the exports API for cross-account access.”','“Explain exactly why finding ST-042 is proven.”','“Show me why the previous retest failed.”','“Open Request Lab and replay this request.”','“Run the focused access-control test.”'];let voiceIdx=0;
function setVoice(){byId('voice-text').textContent=voiceCommands[voiceIdx]}
const voiceWorkflows=[['partner',0],['partner',1],['partner',3],['partner',4],['partner',5],['focused',0]];
byId('voice-cycle').addEventListener('click',()=>{
  voiceIdx=(voiceIdx+1)%voiceCommands.length;
  const [mode,example]=voiceWorkflows[voiceIdx];
  chooseMode(mode);renderExample(example);setVoice();restartClock();
  if(!reduced.matches) byId('voice-text').animate([{opacity:.25},{opacity:1}],{duration:220});
});
function chooseMode(mode){currentMode=mode;currentExample=0;root.querySelectorAll('[data-mode]').forEach(el=>{const selected=el.dataset.mode===mode;el.setAttribute('aria-pressed',String(selected));el.setAttribute('aria-selected',String(selected));el.tabIndex=selected?0:-1;const cue=el.querySelector('.mode-cta');if(cue)cue.firstChild.textContent=selected?'Showing demo ':'View demo '});byId('assistant-mode-panel').setAttribute('aria-labelledby','assistant-tab-'+mode);byId('console-product').textContent='STEINER / '+modes[mode][0];byId('left-title').textContent=modes[mode][1];byId('workspace-loc').textContent=`${modes[mode][2]} / APP.EXAMPLE.COM / ENGAGEMENT-12`;const list=byId('example-list');list.replaceChildren();scenarios[mode].forEach((s,i)=>{let b=document.createElement('button');b.className='example-btn';b.type='button';b.textContent=s.label;b.setAttribute('aria-pressed',String(i===0));b.addEventListener('click',()=>{renderExample(i);restartClock()});list.append(b)});renderExample(0)}
function renderExample(i){currentExample=i;const s=scenarios[currentMode][i];byId('example-list').querySelectorAll('button').forEach((b,k)=>b.setAttribute('aria-pressed',String(k===i)));byId('user-title').textContent=currentMode==='off'?'OPERATOR · AUTOMATION':currentMode==='partner'?'YOU · CHAT / VOICE':currentMode==='swarm'?'OPERATOR · ASSESSMENT':currentMode==='focused'?'OPERATOR · TEST TARGET':'OPERATOR · INVESTIGATION';byId('user-message').textContent=s.user;byId('user-attachment').textContent=s.attachment||'scope: staging.example.com';byId('agent-title').textContent=s.role;byId('agent-message').textContent=s.agent;byId('agent-addendum').textContent=s.source;byId('operator-hint').textContent=s.hint;byId('workspace-state').textContent=s.state;byId('run-title').textContent='EXECUTION / '+s.source;byId('run-meta').textContent=s.steps.length+' STEPS';let steps=byId('run-steps');steps.replaceChildren();s.steps.forEach(t=>{const li=document.createElement('li');const b=document.createElement('span');const content=document.createElement('span');b.className='bullet'+(t.startsWith('○')?' pending':'');b.textContent=t.startsWith('○')?'○':'✓';content.className='text';content.textContent=t.replace(/^[✓○]\s*/,'');li.append(b,content);steps.append(li)});byId('result').className='result'+(s.statusType==='pending'?' pending':s.statusType==='info'?' info':'');byId('result-title').textContent=s.resultTitle||'Finding evidence';byId('result-status').textContent=s.result;byId('result-code').textContent=s.code;byId('result-foot').replaceChildren();s.footer.forEach(t=>{let sp=document.createElement('span');sp.textContent=t;byId('result-foot').append(sp)});animateContent()}
root.querySelectorAll('[data-mode]').forEach(el=>el.addEventListener('click',()=>{chooseMode(el.dataset.mode);restartClock()}));

  const order = ['off','on','swarm','focused','partner'];
  const toggle = root.querySelector('.rotation-toggle');
  const progress = root.querySelector('.cycle-progress');
  function isRunning() {return !paused && !focused && visible && !document.hidden;}
  function restartClock() {
    lastExample = 0;
    if (progressAnimation) progressAnimation.cancel();
    progressAnimation = progress.animate([{strokeDashoffset:'43.983'},{strokeDashoffset:'0'}],{duration:6000,fill:'forwards',easing:'linear'});
    syncRotation();
  }
  function syncRotation() {
    root.querySelector('.workspace').setAttribute('aria-live',isRunning() ? 'off' : 'polite');
    toggle.querySelector('.rotation-label').textContent = paused ? 'Play demo' : 'Pause autoplay';
    root.classList.toggle('is-demo-hidden',document.hidden || !visible);
    toggle.setAttribute('aria-pressed',String(paused));
    toggle.setAttribute('aria-label',paused ? 'Start automatic tab rotation' : 'Pause automatic tab rotation');
    if(progressAnimation) {if(isRunning()) progressAnimation.play(); else progressAnimation.pause();}
  }
  toggle.addEventListener('click',()=>{paused=!paused;syncRotation()}, {signal:events.signal});
  root.addEventListener('focusin',e=>{focused=e.target.matches(':focus-visible');syncRotation()}, {signal:events.signal});
  root.addEventListener('focusout',e=>{if(!root.contains(e.relatedTarget)){focused=false;syncRotation()}}, {signal:events.signal});
  document.addEventListener('visibilitychange',syncRotation,{signal:events.signal});
  reduced.addEventListener('change',()=>{paused=reduced.matches;syncRotation()},{signal:events.signal});
  const tabs=[...root.querySelectorAll('[data-mode]')];
  root.querySelector('.mode-grid').addEventListener('keydown',e=>{
    const active=tabs.indexOf(e.target);if(active<0)return;
    let next;if(e.key==='ArrowRight')next=(active+1)%tabs.length;else if(e.key==='ArrowLeft')next=(active+tabs.length-1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;
    e.preventDefault();tabs[next].click();tabs[next].focus();
  },{signal:events.signal});
  const visibleTargets = new Set();
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting)visibleTargets.add(entry.target);else visibleTargets.delete(entry.target)});
    visible=visibleTargets.size>0;syncRotation();
  },{threshold:0});
  observer.observe(root.querySelector('.mode-grid'));
  observer.observe(root.querySelector('.workspace'));
  // Reserve the largest example at this width so tab changes do not move the page.
  function reserveLayout() {
    const originalRoot = root, savedMode = currentMode, savedExample = currentExample;
    const clone = root.cloneNode(true);
    clone.setAttribute('aria-hidden','true');
    clone.style.cssText += ';position:fixed;left:-20000px;top:0;visibility:hidden;pointer-events:none;width:'+root.getBoundingClientRect().width+'px';
    clone.querySelector('.examples-line').style.minHeight = '';
    clone.querySelector('.workspace-cols').style.minHeight = '';
    clone.querySelector('.workspace-top').style.minHeight = '';
    originalRoot.parentElement.append(clone);
    let exampleHeight = 0, workspaceHeight = 0, topHeight = 0;
    measuring = true;
    try {
      root = clone;
      order.forEach(mode => {
        chooseMode(mode);
        exampleHeight = Math.max(exampleHeight, root.querySelector('.examples-line').getBoundingClientRect().height);
        scenarios[mode].forEach((_,i) => {
          renderExample(i);
          workspaceHeight = Math.max(workspaceHeight,root.querySelector('.workspace-cols').getBoundingClientRect().height);
          topHeight = Math.max(topHeight,root.querySelector('.workspace-top').getBoundingClientRect().height);
        });
      });
    } finally {
      root = originalRoot; currentMode = savedMode; currentExample = savedExample;
      clone.remove(); measuring = false;
    }
    root.querySelector('.examples-line').style.minHeight = Math.ceil(exampleHeight)+'px';
    root.querySelector('.workspace-cols').style.minHeight = Math.ceil(workspaceHeight)+'px';
    root.querySelector('.workspace-top').style.minHeight = Math.ceil(topHeight)+'px';
    layoutWidth = root.querySelector('.wrap').getBoundingClientRect().width;
  }
  chooseMode('partner');setVoice();reserveLayout();restartClock();
  const resizeObserver = new ResizeObserver(() => {
    const width = root.querySelector('.wrap').getBoundingClientRect().width;
    if(Math.abs(width-layoutWidth)>.5) reserveLayout();
  });
  resizeObserver.observe(root.querySelector('.wrap'));
  document.fonts.ready.then(()=>{if(!events.signal.aborted) reserveLayout()});
  const timer=setInterval(()=>{
    if(!isRunning())return;
    const elapsed = progressAnimation ? Number(progressAnimation.currentTime) || 0 : 0;
    if(elapsed>=6000){chooseMode(order[(order.indexOf(currentMode)+1)%order.length]);voiceIdx=(voiceIdx+1)%voiceCommands.length;setVoice();restartClock();}
    else if(elapsed>=3000 && lastExample===0){lastExample=1;renderExample((currentExample+1)%scenarios[currentMode].length);}
  },100);
  return ()=>{events.abort();observer.disconnect();resizeObserver.disconnect();clearInterval(timer);if(progressAnimation)progressAnimation.cancel();contentAnimations.forEach(a=>a.cancel());};
};
