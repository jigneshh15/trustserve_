import { createContext, useContext, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
  useSearchParams,
  Navigate
} from "react-router-dom";
import axios from "axios";
import {
  ArrowRight, Search, MapPin, ShieldCheck, Check, Menu, X,
  ChevronRight, Sparkles, Wrench, Zap, Wind, Paintbrush, Hammer,
  Monitor, Refrigerator, Bug, House, Clock, Star, CalendarDays,
  Bell, LogOut
} from "lucide-react";
import './style.css';

const api=axios.create({baseURL:'https://trustserve-api.onrender.com/api',withCredentials:true,withXSRFToken:false});
let csrf;
async function request(method,url,data){
    if(method!=='get'){
        csrf=await api.get('/auth/csrf').then(r=>r.data);
        return api({method,url,data,headers:{[csrf.header]:csrf.token}}).then(r=>r.data)
    }
    return api.get(url).then(r=>r.data)
}
const get=u=>request('get',u),post=(u,d)=>request('post',u,d);
const Auth=createContext();
const money=n=>'₹'+Number(n).toLocaleString('en-IN');
const icons={'Cleaning':Sparkles,'Plumbing':Wrench,'Electrical':Zap,'AC care':Wind,'Appliances':Refrigerator,'Carpentry':Hammer,'Painting':Paintbrush,'Pest control':Bug,'Maintenance':House,'Computers':Monitor};

function App(){
    const[user,setUser]=useState(null),[ready,setReady]=useState(false);
    useEffect(()=>{
        get('/auth/me').then(setUser).catch(()=>{}).finally(()=>setReady(true))
    },[]);
    return <Auth.Provider value={{user,setUser,ready}}>
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/services" element={<Services/>}/>
                <Route path="/services/:id" element={<Detail/>}/>
                <Route path="/book/:id" element={<Protected><Book/></Protected>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Login register/>}/>
                <Route path="/dashboard" element={<Protected><Dashboard/></Protected>}/>
                <Route path="/profile" element={<Protected><Profile/></Protected>}/>
                <Route path="/support" element={<Protected><Support/></Protected>}/>
                <Route path="/:page" element={<Info/>}/>
            </Routes>
            <Footer/>
        </BrowserRouter>
    </Auth.Provider>
}

function Protected({ children }) {
    const { user } = useContext(Auth);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function Header(){
    const{user,setUser}=useContext(Auth),[open,setOpen]=useState(false);
    const nav=useNavigate();
    return <>
        <div className="demo-strip">A student-built marketplace. Verification & payments are simulated.</div>
        <header>
            <Link className="logo" to="/">
                <span className="logo-mark">t<span>.</span></span>trustserve<span className="logo-dot">.</span>
            </Link>
            <nav className={open?'open':''} onClick={()=>setOpen(false)}>
                <Link to="/services">Find a service</Link>
                <a href="/#how">How it works</a>
                <Link to="/about">Our story</Link>
                <Link to="/register?role=PROFESSIONAL">For professionals</Link>
            </nav>
            <div className="account-nav">
                {user?<>
                    <Link to="/dashboard" className="button small">My dashboard</Link>
                    <button aria-label="Sign out" className="icon-button" onClick={async()=>{
                        await post('/auth/logout',{});
                        setUser(null);
                        nav('/')
                    }}>
                        <LogOut size={18}/>
                    </button>
                </>:<Link to="/login" className="button outline small">Log in <ArrowRight size={16}/></Link>}
                <button className="mobile-menu icon-button" aria-label="Toggle navigation" onClick={()=>setOpen(!open)}>
                    {open?<X/>:<Menu/>}
                </button>
            </div>
        </header>
    </>
}

function Footer(){
    return <footer>
        <div>
            <Link className="logo" to="/">trustserve.</Link>
            <p>Good people. Good work.<br/>A home you can feel good about.</p>
        </div>
        <div>
            <h4>Explore</h4>
            <Link to="/services">Our services</Link>
            <Link to="/about">About TrustServe</Link>
            <Link to="/register?role=PROFESSIONAL">Become a professional</Link>
        </div>
        <div>
            <h4>Here to help</h4>
            <Link to="/support">Support & complaints</Link>
            <Link to="/privacy">Privacy policy</Link>
            <Link to="/terms">Terms of service</Link>
        </div>
        <div className="footer-bottom">
            © {new Date().getFullYear()} TrustServe. Academic prototype.
            <span>Made for a little more peace of mind.</span>
        </div>
    </footer>
}

function ErrorBox({error}){
    return error
        ? <div role="alert" className="error">{error}</div>
        : null;
}

function err(e) {
    const message = e.response?.data?.message;
    if (message) return message;

    const error = e.response?.data?.error;
    if (error) return error;

    if (e.response?.status === 401)
        return "Your session could not be verified. Please try again.";

    if (e.response?.status === 403)
        return "Your request was blocked. Please refresh the page and try again.";

    if (e.response?.status === 400)
        return "Please check the information you entered.";

    if (!e.response)
        return "Cannot connect to TrustServe server. Please check your internet connection.";

    return "Something went wrong. Please try again.";
}

function useData(url){
    const[data,setData]=useState(null),[error,setError]=useState('');
    function reload(){
        setError('');
        return get(url).then(setData).catch(e=>setError(err(e)))
    }
    useEffect(()=>{reload()},[url]);
    return{data,error,reload}
}

function ServiceCard({s}){
    const Icon=icons[s.category.name]||House;
    return <Link className="service-card" to={'/services/'+s.id}>
        <div className="card-photo">
            <img src={s.image} alt={s.category.name==='Cleaning'?'Home cleaning equipment':'Home service setting'}/>
            <span className="category-icon"><Icon size={22}/></span>
        </div>
        <div className="card-content">
            <span className="eyebrow muted">{s.category.name}</span>
            <h3>{s.name}</h3>
            <p>{s.description}</p>
            <div className="card-bottom">
                <span>From <strong>{money(s.price)}</strong></span>
                <span className="round-arrow"><ArrowRight size={20}/></span>
            </div>
        </div>
    </Link>
}

function Home(){
    const{data,error}=useData('/services'),[q,setQ]=useState(''),[city,setCity]=useState('Ahmedabad');
    const nav=useNavigate();
    return <>
        <section className="hero container">
            <div className="hero-copy">
                <div className="eyebrow"><span className="tiny-line"/> HOME, TAKEN CARE OF.</div>
                <h1>Less on your list.<br/><em>More life at home.</em></h1>
                <p>Reliable home services. Trusted professionals.<br/>From the leaky tap to a Sunday deep clean, find the right help for your home.</p>
                <form className="search-box" onSubmit={e=>{
                    e.preventDefault();
                    nav('/services?q='+encodeURIComponent(q)+'&city='+encodeURIComponent(city))
                }}>
                    <label>
                        <MapPin size={18}/>
                        <select aria-label="Your city" value={city} onChange={e=>setCity(e.target.value)}>
                            <option>Ahmedabad</option><option>Gandhinagar</option>
                        </select>
                    </label>
                    <label className="search-input">
                        <Search size={20}/>
                        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="What needs taking care of?" aria-label="Search services"/>
                    </label>
                    <button aria-label="Search"><ArrowRight/></button>
                </form>
                <div className="hero-promises">
                    <span><Check size={15}/> Upfront prices</span>
                    <span><Check size={15}/> Flexible appointments</span>
                </div>
            </div>
            <div className="hero-image">
                <img src="/images/home.jpg" alt="A bright, comfortably furnished living room"/>
                <div className="image-note">
                    <ShieldCheck size={28}/>
                    <div>
                        <strong>A little help. A lot of care.</strong>
                        <span>Professional verification is simulated in this demo.</span>
                    </div>
                </div>
                <span className="photo-label">Room to live. We’ll handle the rest.</span>
            </div>
        </section>
        <section className="category-bar container">
            {Object.entries(icons).slice(0,8).map(([name,Icon])=>
                <Link key={name} to={'/services?category='+encodeURIComponent(name)}>
                    <Icon size={27} strokeWidth={1.5}/><span>{name}</span>
                </Link>
            )}
        </section>
        <section className="section container">
            <div className="section-heading">
                <div>
                    <span className="eyebrow muted">THE EVERYDAY ESSENTIALS</span>
                    <h2>Small fixes. Fresh starts.</h2>
                    <p>The services that keep your home feeling like home.</p>
                </div>
                <Link className="text-link" to="/services">Explore all services <ArrowRight size={18}/></Link>
            </div>
            <ErrorBox error={error}/>
            <div className="service-grid">
                {data?.filter((s,i)=>[0,3,5,7].includes(i)).map(s=><ServiceCard key={s.id} s={s}/>)}
            </div>
        </section>
        <section id="how" className="how-section">
            <div className="container">
                <div className="section-heading">
                    <div>
                        <span className="eyebrow muted">NO COMPLICATED PLANS</span>
                        <h2>Good help, in four simple steps.</h2>
                    </div>
                    <p>Pick what you need.<br/>We’ll take it from there.</p>
                </div>
                <div className="steps">
                    {[
                        ['01','Find your service','Choose the job and see exactly what’s included.'],
                        ['02','Meet your professional','Browse skills, service areas and demo verification.'],
                        ['03','Make it a date','Choose a time that fits your day and confirm the price.'],
                        ['04','Enjoy your space','Track the visit, then share your honest feedback.']
                    ].map(([n,t,p])=><div key={n}><span>{n}</span><h3>{t}</h3><p>{p}</p></div>)}
                </div>
            </div>
        </section>
        <section className="section container trust-section">
            <div>
                <span className="eyebrow muted">BUILT AROUND TRUST</span>
                <h2>Your home deserves<br/>a thoughtful approach.</h2>
                <p>Clear prices, a clear process, and someone to turn to when things need attention.</p>
                <Link to="/about" className="text-link">Get to know TrustServe <ArrowRight size={18}/></Link>
            </div>
            <div className="trust-list">
                {[
                    ['No surprise totals','The service price appears before you confirm. Extra work needs a separate agreement.'],
                    ['Know who’s coming','View professional experience and simulated verification status before booking.'],
                    ['Support that stays with you','Raise a ticket from your account and track the response.']
                ].map(([t,p])=><article key={t}><ShieldCheck/><div><h3>{t}</h3><p>{p}</p></div></article>)}
            </div>
        </section>
        <section className="join container">
            <div>
                <span className="eyebrow">GOOD AT WHAT YOU DO?</span>
                <h2>There’s a place for you here.</h2>
                <p>Bring your skills. Build your local service business.</p>
            </div>
            <Link to="/register?role=PROFESSIONAL" className="button light">Join as a professional <ArrowRight size={18}/></Link>
        </section>
    </>
}

function Services(){
    const{data,error}=useData('/services'),{data:pros}=useData('/professionals');
    const[params]=useSearchParams();
    const[q,setQ]=useState(params.get('q')||''),[cat,setCat]=useState(params.get('category')||''),[max,setMax]=useState(''),[sort,setSort]=useState('name'),[city,setCity]=useState(params.get('city')||'Ahmedabad'),[available,setAvailable]=useState(false);
    const list=(data||[]).filter(s=>(s.name+' '+s.description+' '+s.category.name).toLowerCase().includes(q.toLowerCase())&&(!cat||s.category.name===cat)&&(!max||s.price<=+max)&&(!available||(pros||[]).some(p=>p.available&&p.verification==='Verified'&&p.area.toLowerCase().includes(city.toLowerCase())&&p.skills.split(',').map(x=>x.trim()).includes(s.category.name)))).sort((a,b)=>sort==='price'?a.price-b.price:sort==='price-desc'?b.price-a.price:a.name.localeCompare(b.name));
    return <main className="container section">
        <span className="eyebrow muted">A LITTLE HELP GOES A LONG WAY</span>
        <h1 className="page-title">What can we help with?</h1>
        <p className="lead">Choose a service. See the scope and price before you book.</p>
        <div className="filters">
            <label><Search size={18}/><input aria-label="Search services" placeholder="Search services" value={q} onChange={e=>setQ(e.target.value)}/></label>
            <select aria-label="Category" value={cat} onChange={e=>setCat(e.target.value)}>
                <option value="">All categories</option>
                {[...new Set(data?.map(s=>s.category.name))].map(c=><option key={c}>{c}</option>)}
            </select>
            <input aria-label="Maximum price" type="number" min="1" placeholder="Max price ₹" value={max} onChange={e=>setMax(e.target.value)}/>
            <select aria-label="City" value={city} onChange={e=>setCity(e.target.value)}>
                <option>Ahmedabad</option><option>Gandhinagar</option>
            </select>
            <select aria-label="Sort" value={sort} onChange={e=>setSort(e.target.value)}>
                <option value="name">Name A–Z</option><option value="price">Price: low to high</option><option value="price-desc">Price: high to low</option>
            </select>
        </div>
        <label className="check-label">
            <input type="checkbox" checked={available} onChange={e=>setAvailable(e.target.checked)}/>
            Only services with available, demo-verified professionals in {city}
        </label>
        <div className="results-line">{list.length} services <span>Transparent sample pricing · INR</span></div>
        <ErrorBox error={error}/>
        {!data&&!error?<Loading/>:list.length?<div className="service-grid">{list.map(s=><ServiceCard s={s} key={s.id}/>)}</div>:<div className="empty">No services match those filters. Try a different search.</div>}
    </main>
}

function Detail(){
    const{id}=useParams(),{data:s,error}=useData('/services/'+id),{data:pros}=useData('/professionals');
    if(!s)return <main className="container"><ErrorBox error={error}/>{!error&&<Loading/>}</main>;
    return <main className="container section">
        <Link className="text-link" to="/services">← All services</Link>
        <div className="detail-grid">
            <div>
                <img className="detail-image" src={s.image} alt={s.category.name+' service'}/>
                <span className="eyebrow muted">{s.category.name}</span>
                <h1 className="page-title">{s.name}</h1>
                <p className="lead">{s.description}</p>
                <div className="scope">
                    <div><h3>What’s included</h3><p><Check size={18}/> {s.included}</p></div>
                    <div><h3>What’s separate</h3><p>{s.excluded}. Any extra work requires your agreement.</p></div>
                </div>
                <h2>People who can help</h2>
                <div className="pro-list">
                    {pros?.filter(p=>p.verification==='Verified'&&p.skills.split(',').map(x=>x.trim()).includes(s.category.name)).map(p=><Professional key={p.id} p={p}/>)}
                </div>
                <h2>A few useful answers</h2>
                <details><summary>Can I cancel my booking?</summary><p>You can cancel before work starts. Online demo payments are marked as refunded. No real money moves.</p></details>
                <details><summary>What if there is a problem?</summary><p>{s.warranty} Use your support dashboard to contact the administrator.</p></details>
                <details><summary>Is verification real?</summary><p>No. This academic prototype uses simulated checks and sample professionals. Do not upload real identity documents.</p></details>
            </div>
            <aside className="booking-summary">
                <span className="eyebrow muted">YOUR VISIT</span>
                <h2>{money(s.price)}</h2>
                <p>Sample service price · no platform fee</p>
                <div className="summary-row"><Clock size={18}/>{s.duration} minutes estimated</div>
                <div className="summary-row"><ShieldCheck size={18}/>Choose a demo-verified professional</div>
                <Link className="button full" to={'/book/'+s.id}>Choose a time <ArrowRight size={18}/></Link>
                <p className="fine">Parts are excluded. Discuss additional work before it begins.</p>
            </aside>
        </div>
    </main>
}

function Professional({p}){
    const{data:reviews}=useData('/professionals/'+p.id+'/reviews');
    return <article className="professional">
        <span className="avatar">{p.name.split(' ').slice(0,2).map(s=>s[0]).join('')}</span>
        <div>
            <h3>{p.name}</h3>
            <p>{p.experience} experience · {p.area}</p>
            <span className="verified"><ShieldCheck size={14}/> {p.verification} · simulated</span>
            <p>{reviews?.length?`${(reviews.reduce((n,r)=>n+r.rating,0)/reviews.length).toFixed(1)} / 5 from ${reviews.length} reviews`:'No customer reviews yet'}</p>
        </div>
    </article>
}

function Login({register=false}){
    const{setUser}=useContext(Auth),[params]=useSearchParams(),nav=useNavigate(),[error,setError]=useState(''),[busy,setBusy]=useState(false);
    return <main className="auth-page">
        <div className="auth-story">
            <span className="eyebrow">WELCOME TO TRUSTSERVE</span>
            <h1>A better day<br/>starts at home.</h1>
            <p>Good help is closer than you think.</p>
            <img src="/images/home.jpg" alt="Comfortable living space"/>
        </div>
        <form className="auth-form" onSubmit={async e=>{
            e.preventDefault();
            setBusy(true);
            setError('');
            let d=Object.fromEntries(new FormData(e.currentTarget));
            try{
                if(register)await post('/auth/register',d);
                setUser(await post('/auth/login',d));
                nav('/dashboard')
            }catch(e){
                setError(err(e))
            }finally{
                setBusy(false)
            }
        }}>
            <h2>{register?'Make yourself at home.':'Welcome back.'}</h2>
            <p>{register?'Create an account to book, or join as a professional.':'Sign in to keep everything in one place.'}</p>
            <ErrorBox error={error}/>
            {register&&<>
                <label>Full name<input name="name" required minLength="2" autoComplete="name"/></label>
                <label>I’m here to<select name="role" defaultValue={params.get('role')||'CUSTOMER'}>
                    <option value="CUSTOMER">Book a service</option><option value="PROFESSIONAL">Offer my services</option>
                </select></label>
            </>}
            <label>Email address<input name="email" type="email" required autoComplete="email"/></label>
            <label>Password<input name="password" type="password" minLength={register?10:1} maxLength="72" required autoComplete={register?'new-password':'current-password'}/></label>
            {register&&<small>Use 10–72 characters, including letters and numbers.</small>}
            <button disabled={busy} className="button full">{busy?'Please wait…':register?'Create account':'Log in'}<ArrowRight size={18}/></button>
            <p>{register?'Already have an account?':'New around here?'} <Link to={register?'/login':'/register'}>{register?'Log in':'Create an account'}</Link></p>
            <div className="demo-help">
                <strong>Trying the classroom demo?</strong>
                <p>Customer: customer@trustserve.demo<br/>Professional: professional@trustserve.demo<br/>Admin: admin@trustserve.demo</p>
                <small>Use the DEMO_PASSWORD you configured during setup. No real payments or identity verification.</small>
            </div>
        </form>
    </main>
}

function Book(){
    const{id}=useParams(),{data:s}=useData('/services/'+id),{data:pros}=useData('/professionals'),[error,setError]=useState(''),[busy,setBusy]=useState(false),[done,setDone]=useState(null);
    if(!s||!pros)return <Loading/>;
    const eligible=pros.filter(p=>p.verification==='Verified'&&p.available&&p.area==='Ahmedabad'&&p.skills.split(',').map(x=>x.trim()).includes(s.category.name));
    if(done)return <main className="container section confirmation">
        <span className="confirmation-check"><Check size={35}/></span>
        <h1>You’re on the list.</h1>
        <p>Booking #{done.id} is pending professional acceptance.</p>
        <div className="receipt">
            <h3>{done.service.name}</h3><p>{done.professional.account.name}</p><p>{done.date} at {done.slot}</p><p>{done.address}</p><strong>{money(done.amount)} · {done.method}</strong>
        </div>
        <Link to="/dashboard" className="button">Track your booking <ArrowRight size={18}/></Link>
    </main>;
    return <main className="container section">
        <span className="eyebrow muted">MAKE ROOM IN YOUR DAY</span>
        <h1 className="page-title">Book your {s.name.toLowerCase()}.</h1>
        <div className="detail-grid">
            <form className="form-sheet" onSubmit={async e=>{
                e.preventDefault();
                setBusy(true);
                setError('');
                let d=Object.fromEntries(new FormData(e.currentTarget));
                d.address=[d.house,d.street,d.area,d.city,d.postcode].join(', ');
                try{
                    setDone(await post('/bookings',{...d,serviceId:s.id}))
                }catch(e){
                    setError(err(e))
                }finally{
                    setBusy(false)
                }
            }}>
                <ErrorBox error={error}/>
                <h3>01 · Choose your professional</h3>
                <label>Available in Ahmedabad<select name="professionalId" required>
                    <option value="">Select a professional</option>
                    {eligible.map(p=><option key={p.id} value={p.id}>{p.name} · {p.experience}</option>)}
                </select></label>
                {!eligible.length&&<p>No eligible professionals currently offer this service. Please check back later.</p>}
                <h3>02 · Find a time</h3>
                <div className="form-row">
                    <label>Date<input name="date" required type="date" min={new Date().toLocaleDateString('en-CA')}/></label>
                    <label>Time<select name="slot"><option>09:00</option><option>11:00</option><option>14:00</option><option>16:00</option></select></label>
                </div>
                <h3>03 · Where should we come?</h3>
                <div className="form-row">
                    <label>House / building<input name="house" required/></label>
                    <label>Street<input name="street" required/></label>
                </div>
                <div className="form-row">
                    <label>Area<input name="area" required/></label>
                    <label>City<select name="city"><option>Ahmedabad</option></select></label>
                    <label>Postal code<input name="postcode" inputMode="numeric" pattern="[0-9]{6}" required/></label>
                </div>
                <label>Anything we should know?<textarea name="instructions" placeholder="Access instructions, parking, or details about the job"/></label>
                <h3>04 · Payment</h3>
                <label>Payment method<select name="method"><option>Cash on Service</option><option>Online Demo</option></select></label>
                <label>Demo payment outcome<select name="paymentResult"><option value="success">Successful simulation</option><option value="fail">Simulate payment failure (testing)</option></select></label>
                <p className="fine">No payment details are collected. By booking, you accept the <Link to="/terms">prototype terms</Link>.</p>
                <button disabled={busy||!eligible.length} className="button">{busy?'Confirming…':'Confirm booking'}<ArrowRight size={18}/></button>
            </form>
            <aside className="booking-summary">
                <h3>Your booking summary</h3>
                <p>{s.name}</p>
                <div className="price-row"><span>Service</span><strong>{money(s.price)}</strong></div>
                <div className="price-row"><span>Visit / platform fee</span><span>₹0</span></div>
                <div className="price-row"><span>Discount</span><span>₹0</span></div>
                <div className="price-row total"><span>Total</span><strong>{money(s.price)}</strong></div>
                <p className="fine">Sample pricing. Parts and any additional work are excluded. Slot availability is checked when you confirm.</p>
            </aside>
        </div>
    </main>
}

function Dashboard(){
    const{user}=useContext(Auth);
    return user.role==='ADMIN'?<Admin/>:<Jobs/>
}

function DashboardNav(){
    return <div className="dashboard-nav">
        <Link to="/dashboard">Overview & bookings</Link>
        <Link to="/profile">My profile</Link>
        <Link to="/support">Support</Link>
    </div>
}

function Jobs(){
    const{user}=useContext(Auth),{data:jobs,error,reload}=useData('/bookings'),{data:notices,reload:reloadNotices}=useData('/notifications'),{data:payments}=useData('/payments'),[message,setMessage]=useState(''),[review,setReview]=useState(null),[history,setHistory]=useState(null);
    const professional=user.role==='PROFESSIONAL';
    async function status(b,status){
        try{
            await post('/bookings/'+b.id+'/status',{status});
            await reload();
            reloadNotices();
            setMessage('Booking updated.')
        }catch(e){
            setMessage(err(e))
        }
    }
    return <main className="container section">
        <DashboardNav/>
        <span className="eyebrow muted">YOUR TRUSTSERVE</span>
        <div className="section-heading">
            <h1 className="page-title">Hello, {user.name.split(' ')[0]}.</h1>
            <Link className="button" to={professional?'/profile':'/services'}>{professional?'Manage availability':'Book a service'}<ArrowRight size={18}/></Link>
        </div>
        <p>{professional?'Your workday, in one place.':'A little less to keep track of.'}</p>
        <div className="stats">
            {[
                ['Total bookings',jobs?.length||0],
                ['Upcoming',jobs?.filter(b=>!['Completed','Cancelled','Rejected'].includes(b.status)).length||0],
                ['Completed',jobs?.filter(b=>b.status==='Completed').length||0],
                [professional?'Net earnings (demo, 90%)':'Cancelled',professional?money(jobs?.filter(b=>b.status==='Completed').reduce((n,b)=>n+b.amount*.9,0)||0):jobs?.filter(b=>b.status==='Cancelled').length||0]
            ].map(([label,v])=><div key={label}><strong>{v}</strong><span>{label}</span></div>)}
        </div>
        <ErrorBox error={error}/>
        {message&&<div role="status" className="notice">{message}</div>}
        <h2>{professional?'Your jobs':'Your bookings'}</h2>
        {!jobs?<Loading/>:!jobs.length?<div className="empty">
            <CalendarDays size={32}/><h3>A clear calendar, for now.</h3>
            <p>{professional?'Eligible requests will appear here.':'Find a service and book your first visit.'}</p>
        </div>:<div className="booking-list">
            {jobs.slice().reverse().map(b=><article className="booking-row" key={b.id}>
                <div>
                    <span className="eyebrow muted">BOOKING #{b.id}</span>
                    <h3>{b.service.name}</h3>
                    <p>{b.date} · {b.slot} · {professional?b.customer.name:b.professional.account.name}</p>
                    <p>{b.address}</p>
                    <small>{payments?.find(p=>p.booking.id===b.id)?.status} · {b.method}</small>
                </div>
                <div className="booking-actions">
                    <span className={'status '+b.status.replaceAll(' ','-')}>{b.status}</span>
                    <strong>{money(b.amount)}</strong>
                    <div className="actions">
                        {professional&&['Pending','Confirmed','Professional Assigned'].includes(b.status)&&<>
                            <button onClick={()=>status(b,'Accepted')}>Accept</button>
                            <button onClick={()=>status(b,'Rejected')}>Reject</button>
                        </>}
                        {professional&&b.status==='Accepted'&&<button onClick={()=>status(b,'In Progress')}>Start job</button>}
                        {professional&&b.status==='In Progress'&&<button onClick={()=>status(b,'Completed')}>Complete job</button>}
                        {!professional&&['Pending','Confirmed','Professional Assigned','Accepted'].includes(b.status)&&<button onClick={()=>{if(confirm('Cancel this booking?'))status(b,'Cancelled')}}>Cancel</button>}
                        {!professional&&b.status==='Completed'&&<button onClick={()=>setReview(b.id)}>Review</button>}
                        <a href={'/api/bookings/'+b.id+'/invoice'}>Invoice</a>
                        <button onClick={async()=>{
                            try{setHistory(await get('/bookings/'+b.id+'/history'))}
                            catch(e){setMessage(err(e))}
                        }}>Timeline</button>
                    </div>
                </div>
            </article>)}
        </div>}
        {review&&<div className="modal-backdrop">
            <form className="modal" onSubmit={async e=>{
                e.preventDefault();
                try{
                    await post('/reviews',{...Object.fromEntries(new FormData(e.currentTarget)),bookingId:review});
                    setReview(null);
                    setMessage('Thanks for your honest feedback.')
                }catch(e){
                    setMessage(err(e));setReview(null)
                }
            }}>
                <button type="button" className="close" onClick={()=>setReview(null)} aria-label="Close"><X/></button>
                <h2>How did it go?</h2>
                <label>Rating<select name="rating">{[5,4,3,2,1].map(n=><option key={n}>{n}</option>)}</select></label>
                <label>Your experience<textarea name="comment" minLength="5" maxLength="1500" required/></label>
                <button className="button">Submit review</button>
            </form>
        </div>}
        {history&&<div className="modal-backdrop">
            <div className="modal">
                <button className="close" onClick={()=>setHistory(null)} aria-label="Close"><X/></button>
                <h2>Booking timeline</h2>
                {history.map(h=><p key={h.id}><strong>{h.status}</strong><br/>{new Date(h.createdAt).toLocaleString()}</p>)}
            </div>
        </div>}
        <h2>Updates</h2>
        <div className="updates">
            {notices?.length?notices.slice().reverse().slice(0,8).map(n=><p key={n.id}><Bell size={16}/>{n.message}<small>{new Date(n.createdAt).toLocaleDateString()}</small></p>):<p>Booking updates will appear here.</p>}
        </div>
    </main>
}

function Profile(){
    const{user,setUser}=useContext(Auth),{data,reload}=useData('/profile'),[message,setMessage]=useState('');
    if(!data)return <Loading/>;
    const pro=data.professional;
    return <main className="container section">
        <DashboardNav/>
        <h1 className="page-title">A few details about you.</h1>
        <form className="form-sheet narrow" onSubmit={async e=>{
            e.preventDefault();
            try{
                const d=Object.fromEntries(new FormData(e.currentTarget));
                setUser(await request('put','/profile',d));
                setMessage('Profile saved. Professional changes require a new review.');
                reload()
            }catch(e){setMessage(err(e))}
        }}>
            {message&&<div className="notice">{message}</div>}
            <label>Name<input name="name" defaultValue={user.name} required/></label>
            <label>Email<input value={user.email} disabled/></label>
            <label>Phone<input name="phone" defaultValue={user.phone||''}/></label>
            <label>Address<textarea name="address" defaultValue={user.address||''}/></label>
            {user.role==='PROFESSIONAL'&&<>
                <span className="verified">{pro.verification} · simulated</span>
                <label>Skills / categories (comma-separated)<input name="skills" defaultValue={pro.skills}/></label>
                <label>Service area<input name="area" defaultValue={pro.area}/></label>
                <label>Experience<input name="experience" defaultValue={pro.experience}/></label>
                <label>About your work<textarea name="bio" defaultValue={pro.bio}/></label>
                <label>Availability<select name="available" defaultValue={String(pro.available)}>
                    <option value="true">Available for bookings</option><option value="false">Not accepting bookings</option>
                </select></label>
            </>}
            <button className="button">Save profile</button>
        </form>
        {user.role==='PROFESSIONAL'&&<form className="form-sheet narrow" onSubmit={async e=>{
            e.preventDefault();
            try{
                await post('/verification',new FormData(e.currentTarget));
                setMessage('Demo document submitted for review.');
                reload()
            }catch(e){setMessage(err(e))}
        }}>
            <h2>Demo verification</h2>
            <p>Upload a made-up PDF or PNG document under 2 MB. Do not upload real identity documents.</p>
            <input aria-label="Demo document" name="file" type="file" accept=".pdf,.png" required/>
            <button className="button">Submit for review</button>
        </form>}
    </main>
}

function Support(){
    const{data,reload}=useData('/support'),[message,setMessage]=useState('');
    return <main className="container section">
        <DashboardNav/>
        <h1 className="page-title">We’re here to help.</h1>
        <div className="detail-grid">
            <form className="form-sheet" onSubmit={async e=>{
                e.preventDefault();
                const f=e.currentTarget;
                try{
                    await post('/support',Object.fromEntries(new FormData(f)));
                    f.reset();reload();setMessage('Your ticket has been opened.')
                }catch(e){setMessage(err(e))}
            }}>
                <p>Tell us what happened. Include your booking number if relevant.</p>
                {message&&<div className="notice">{message}</div>}
                <label>Subject<input name="subject" required/></label>
                <label>Message<textarea name="message" required minLength="10"/></label>
                <button className="button">Send support request</button>
            </form>
            <div>
                <h2>Your conversations</h2>
                {data?.length?data.map(t=><article className="ticket" key={t.id}>
                    <span className="status">{t.status}</span><h3>#{t.id} {t.subject}</h3><p>{t.message}</p>
                    {t.response&&<blockquote>{t.response}</blockquote>}
                </article>):<p>No support requests yet.</p>}
            </div>
        </div>
    </main>
}

function Admin(){
    const{data,error,reload}=useData('/admin/data'),{data:cats}=useData('/categories'),[tab,setTab]=useState('professionals'),[message,setMessage]=useState(''),[editing,setEditing]=useState(null),[query,setQuery]=useState('');
    async function act(url,d){
        try{await post(url,d);setMessage('Saved. Action recorded in the audit trail.');reload()}
        catch(e){setMessage(err(e))}
    }
    if(!data)return <main className="container section"><ErrorBox error={error}/>{!error&&<Loading/>}</main>;
    return <main className="container section">
        <DashboardNav/>
        <span className="eyebrow muted">PLATFORM OPERATIONS</span>
        <h1 className="page-title">The bigger picture.</h1>
        <div className="stats">
            {[
                ['Users',data.users.length],
                ['Verified professionals',data.professionals.filter(p=>p.verification==='Verified').length],
                ['Bookings',data.bookings.length],
                ['Commission (demo, 10%)',money(data.bookings.filter(b=>b.status==='Completed').reduce((n,b)=>n+b.amount*.1,0))]
            ].map(([k,v])=><div key={k}><strong>{v}</strong><span>{k}</span></div>)}
        </div>
        <div className="tabs">
            {['professionals','bookings','services','users','reviews','tickets','payments','audit'].map(t=><button className={tab===t?'active':''} key={t} onClick={()=>{setTab(t);setQuery('')}}>{t}</button>)}
        </div>
        {message&&<div className="notice" role="status">{message}</div>}
        <input className="admin-search" aria-label="Search records" placeholder="Search these records…" value={query} onChange={e=>setQuery(e.target.value)}/>
        {tab==='services'&&<div className="actions">
            <button onClick={()=>setEditing({})}>Add service</button>
            <button onClick={()=>{const name=prompt('Category name');if(name)act('/admin/categories',{name})}}>Add category</button>
        </div>}
        <div className="admin-list">
            {data[tab]?.filter(row=>JSON.stringify(row).toLowerCase().includes(query.toLowerCase())).map(r=><article className="admin-row" key={r.id}>
                <div>
                    {tab==='professionals'?<>
                        <h3>{r.account.name}</h3><p>{r.skills} · {r.area} · {r.experience}</p><span className="verified">{r.verification} · simulated</span>
                    </>:tab==='bookings'?<>
                        <h3>#{r.id} {r.service.name}</h3><p>{r.customer.name} / {r.professional.account.name}</p><p>{r.date} {r.slot} · {money(r.amount)} · {r.status}</p>
                    </>:tab==='services'?<>
                        <h3>{r.name}</h3><p>{r.category.name} · {money(r.price)} · {r.duration} mins · {r.active?'Active':'Archived'}</p>
                    </>:tab==='users'?<>
                        <h3>{r.name}</h3><p>{r.email} · {r.role} · {r.active?'Active':'Suspended'}</p>
                    </>:tab==='reviews'?<>
                        <h3>{r.rating}/5 · Booking #{r.booking.id}</h3><p>{r.comment}</p><small>{r.visible?'Visible':'Hidden'} · {r.moderationReason}</small>
                    </>:tab==='tickets'?<>
                        <h3>#{r.id} {r.subject}</h3><p>{r.message}</p><p>{r.status} · {r.response}</p>
                    </>:tab==='payments'?<>
                        <h3>Booking #{r.booking.id} · {money(r.amount)}</h3><p>{r.method} · {r.status}</p><small>{r.reference} · {r.refundStatus}</small>
                    </>:<>
                        <p>{r.action}</p><small>Actor #{r.actor} · {new Date(r.createdAt).toLocaleString()}</small>
                    </>}
                </div>
                <div className="actions">
                    {tab==='professionals'&&<>
                        {r.documentName&&<a href={'/api/admin/document/'+r.id}>View demo document</a>}
                        {['Verified','Rejected','Suspended'].map(status=><button key={status} onClick={()=>{
                            const reason=prompt('Reason for '+status+' (simulated review)');
                            if(reason)act('/admin/verification/'+r.id,{status,reason})
                        }}>{status==='Verified'?'Approve':status==='Rejected'?'Reject':'Suspend'}</button>)}
                    </>}
                    {tab==='bookings'&&<select aria-label={'Change booking '+r.id} value="" onChange={e=>act('/bookings/'+r.id+'/status',{status:e.target.value})}>
                        <option value="">Change status</option>{['Confirmed','Professional Assigned','Accepted','In Progress','Completed','Cancelled','Rejected'].map(s=><option key={s}>{s}</option>)}
                    </select>}
                    {tab==='services'&&<button onClick={()=>setEditing(r)}>Edit / archive</button>}
                    {tab==='users'&&r.role!=='ADMIN'&&<button onClick={()=>act('/admin/users/'+r.id,{active:!r.active})}>{r.active?'Suspend':'Activate'}</button>}
                    {tab==='reviews'&&<button onClick={()=>{
                        const reason=prompt('Moderation reason');
                        if(reason)act('/admin/reviews/'+r.id,{visible:!r.visible,reason})
                    }}>{r.visible?'Hide':'Restore'}</button>}
                    {tab==='tickets'&&<button onClick={()=>{
                        const response=prompt('Response to customer');
                        if(response){
                            const status=prompt('Status: Open, In Review, Resolved, Closed','Resolved');
                            if(status)act('/admin/support/'+r.id,{response,status})
                        }
                    }}>Respond</button>}
                </div>
            </article>)}
        </div>
        {!data[tab]?.length&&<div className="empty">No records yet.</div>}
        {editing&&<div className="modal-backdrop">
            <form className="modal" onSubmit={async e=>{
                e.preventDefault();
                await act('/admin/services',{...Object.fromEntries(new FormData(e.currentTarget)),...(editing.id?{id:editing.id}:{})});
                setEditing(null)
            }}>
                <button type="button" className="close" aria-label="Close" onClick={()=>setEditing(null)}><X/></button>
                <h2>{editing.id?'Edit service':'Add a service'}</h2>
                <label>Name<input name="name" defaultValue={editing.name} required/></label>
                <label>Description<textarea name="description" defaultValue={editing.description} required/></label>
                <div className="form-row">
                    <label>Price ₹<input name="price" type="number" min="1" defaultValue={editing.price} required/></label>
                    <label>Minutes<input name="duration" type="number" min="1" defaultValue={editing.duration} required/></label>
                </div>
                <label>Category<select name="categoryId" defaultValue={editing.category?.id}>{cats?.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
                <label>Visibility<select name="active" defaultValue={String(editing.active??true)}><option value="true">Active</option><option value="false">Archived</option></select></label>
                <button className="button">Save service</button>
            </form>
        </div>}
    </main>
}

function Info(){
    const{page}=useParams();
    const content={
        about:[
            'Good service starts with good people.',
            'TrustServe is a Semester 5 academic prototype for a local home-service marketplace. It brings transparent prices, professional profiles, booking and support into one simple place.',
            'Our pilot scenario is Ahmedabad. Every seeded person is fictional. Professional verification and payments are simulations, not real checks or transactions.',
            'We believe in clearly described work, agreed prices and honest feedback. No invented reviews, countdown timers or hidden subscriptions.'
        ],
        privacy:[
            'Your home. Your information.',
            'This prototype stores account details, addresses, bookings, support requests and demo verification documents for classroom demonstrations.',
            'Use fictional details and made-up documents only. Passwords are hashed. Customers can access their own bookings, assigned professionals see job information, and administrators manage the prototype.',
            'Do not use real personal information until retention, deletion requests, consent, legal requirements, upload scanning and security reviews are implemented. Contact the administrator through Support for deletion requests.'
        ],
        terms:[
            'A few things to know.',
            'TrustServe is an educational prototype, not an operating service provider. Prices are sample amounts in INR. No real services, identity verification or payments are supplied.',
            'The displayed price covers the described service. Parts and additional work are excluded unless separately agreed. Customers can cancel before work begins; demo online payments receive a simulated refund.',
            'Reviews require a completed booking. Administrators may moderate abusive content with an audit reason. Use Support to raise issues. These prototype terms need legal review before any real launch.'
        ]
    };
    const c=content[page];
    return <main className="container section prose">
        {c?<>
            <span className="eyebrow muted">TRUSTSERVE</span>
            <h1 className="page-title">{c[0]}</h1>
            {c.slice(1).map(p=><p key={p}>{p}</p>)}
            <Link className="button" to="/services">Explore services <ArrowRight size={18}/></Link>
        </>:<>
            <h1>That page isn’t here.</h1><Link to="/">Back to home</Link>
        </>}
    </main>
}

function Loading(){
    return <div className="loading"><span className="spinner"/>Loading…</div>
}

createRoot(document.getElementById('root')).render(<App/>);