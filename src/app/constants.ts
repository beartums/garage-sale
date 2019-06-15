export const PATHS = {
    assets: 'assets/',
    itemPics: 'assets/items/',
    tilesUrl: 'tile-list',
    listUrl: 'table-list',
    editUrl: 'edit-item',
    itemUrl: 'show-item',
    adminUrl: 'admin-view',
}

export const DEFAULT_PIC_TOOLTIP = `These photos are NOT (repeat, NOT) necessarily photos 
                of the actual objects. Taking all those pictures is really hard.  
                So the internet provides`;

export const SEND_EMAIL_URL = 'https://us-central1-garage-sale-78809.cloudfunctions.net/sendMail';

export const FAQS = [
    {
        category: 'Website',
        question: `A lot of things are already sold.  You obviously have lots of great stuff!
            But it makes it hard to see the things that I want to buy.  How do I hide the sold items?`,
        answer: `Click on the 'filter' icon (down-arrow in the main toolbar) in the toolbar at the top of the main page.
            that will give you a lot of options for choosing what you want to see.  The very first drop-down will
            allow you to 'Exclude' sold items from the display (NOTE: if you are logged in, your filter choices will
            be saved between visits)`},
    { category: 'Your Stuff',
        question: `I want one of your cool things, but I think you're trying to rip me off and would rather not pay
            what you're asking.  Can I have it for less?`, 
        answer: `Sure thing!  Maybe.  Simply click on the email icon (or email us directly at garage-sale@griffithnet.com) 
            for that item and send us a message about 
            what you want to pay.  We're leaving Jinja in August, so if your's is the largest offer (and no one has bought
            it for the asking price in the meantime) then it will be all yours!`},
        { category: `Jinja`,
            question: `I'd really rather you didn't leave.  Jinja will be much the worse for your departure.  Will you reconsider?`,
            answer: `No.`},
        { category: `Website`,
            question: `I've seen all these things.  You've been here over four years, don't you have more stuff?`,
            answer: `We do!  We're posting things as fast as we can.  You should visit a couple of times a week to 
                keep up with the new stuff (I had a feature that would email you when new stuff got posted, but I shut 
                it off because of a bug that used up my outgoing email quota of 10,000 per day in half an hour). Also, as
                mentioned elsewhere, we will have lots of smaller stuff that we will sell directly on the last week we're here.`},
        { category: `Your Stuff`,
            question: `Can I see the stuff in person before I buy it?`,
            answer: `Absolutely.  Email us directly at garage-sale@griffithnet.com or by clicking on the envelope icon at the top
            of the item you're interested in.  We're glad to set up a convenient viewing.`},
        { category: `Website`,
            question: `I can't keep track of everything.  Can't you make it easier to use?`,
            answer: `Sorry, I had to hack this together in a couple of weekends and it's a little rough.  Right now your best option is
            to 'favorite' some items.  You can do that by logging in (greay circle with a silhouette in the main toolbar) 
            and then clicking on the heart
            icon for the items you're interested in.  Then you can show ONLY the items you have favorited by adding a filter to 'Include'
            favorited items (NOTE: once you do that, you won't be able to see any other items, even new ones, until you remove that filter)`},
        { category: `You`,
            question: `How much money is this website making you?`,
            answer: `Buttloads.`},
            { category: `Prices`,
            question: `I'd rather pay in dollars.  Can I do that?`,
            answer: `YES!  We love dollars.  We love them so much, that if you want to pay in 
            dollars, we will take them at a rate of 4000 ugx = 1 dollar.`},
            { category: `Timing`,
            question: `I want to buy something, but it's not available yet.  What do I do?`,
            answer: `Contact us!  The item will be for sale until we take money for it.  If the 
            item is not available yet, then we will mark it sold and hold onto the item (and keep
            using it) until the date it is available.  The available dates are usually negotiable,`},
            { category: `Timing`,
            question: `What does it mean when it says the item is available in August or late July?`,
            answer: `That basically means we are selling it, but we need it until we leave.  In order
            to secure the item, you must pay for it -- at which point we will mark it sold and not
            offer it for sale on the site, but you still won't be able to take posession until the
            marked available date (sorry).`},
        
]