import fs from 'fs'

const files = [
    'src/pages/InvestPage.jsx',
    'src/pages/RewardsPage.jsx',
    'src/components/MainContent.jsx',
    'src/components/Header.jsx',
    'src/components/BankTransferModal.jsx',
    'src/components/AddMoneyModal.jsx'
];

files.forEach(f => {
    if (!fs.existsSync(f)) {
        console.log('Skipping ' + f);
        return;
    }
    let text = fs.readFileSync(f, 'utf8');

    text = text.replace(/bg-white dark:bg-\[#(?:1c1c1c|121212)\]/g, (m) => m.split('dark:')[1]);
    text = text.replace(/bg-gray-\d+ dark:bg-\[#1c1c1c\]/g, 'bg-[#1c1c1c]');
    text = text.replace(/bg-gray-\d+ dark:bg-\[#121212\]/g, 'bg-[#121212]');
    text = text.replace(/bg-white dark:bg-\[#181818\]/g, 'bg-[#181818]');
    text = text.replace(/bg-gray-\d+ dark:bg-white\/\d+/g, (m) => m.split('dark:')[1]);
    text = text.replace(/bg-green-\d+ dark:bg-\[#1a221d\]/g, 'bg-[#1a221d]');

    text = text.replace(/bg-white dark:bg-transparent/g, 'bg-transparent');
    text = text.replace(/bg-gray-\d+ dark:bg-transparent/g, 'bg-transparent');
    text = text.replace(/bg-gray-\d+ dark:bg-white\/\d+/g, (m) => m.split('dark:')[1]);

    text = text.replace(/text-gray-900 dark:text-white/g, 'text-white');
    text = text.replace(/text-gray-\d+ dark:text-white\/\d+/g, (m) => m.split('dark:')[1]);
    text = text.replace(/text-gray-\d+ dark:text-gray-\d+/g, 'text-gray-400');

    text = text.replace(/border-gray-\d+ dark:border-white\/\d+/g, (m) => m.split('dark:')[1]);
    text = text.replace(/border-transparent dark:border-white\/\d+/g, (m) => m.split('dark:')[1]);
    text = text.replace(/border-green-\d+ dark:border-\[#2a3830\]/g, 'border-[#2a3830]');

    text = text.replace(/shadow-sm dark:shadow-none/g, '');

    text = text.replace(/hover:bg-gray-\d+ dark:hover:bg-white\/\d+/g, (m) => m.split('dark:')[1]);
    text = text.replace(/hover:text-gray-\d+ dark:hover:text-white\/\d+/g, (m) => m.split('dark:')[1]);
    text = text.replace(/hover:text-gray-900 dark:hover:text-white/g, 'hover:text-white');

    text = text.replace(/text-gray-500 dark:text-white\/60/g, 'text-white/60');
    text = text.replace(/text-gray-800 dark:text-white\/80/g, 'text-white/80');
    text = text.replace(/text-gray-400 dark:text-white\/40/g, 'text-white/40');

    fs.writeFileSync(f, text);
    console.log('Fixed ', f);
});
console.log("Cleanup complete!");
