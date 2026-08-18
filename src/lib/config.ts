/**
 * Способи звʼязку — одним місцем.
 *
 * `telegramUrl` жив тут із самого початку, а `ContactDropdown` тримав ту саму
 * адресу вписаною вдруге — плюс номер телефону в двох формах і LinkedIn. Один
 * факт у двох місцях розходиться мовчки, і виявляє це той, хто написав на старий
 * номер (NOTIFICATIONS-v8, анти-патерни).
 *
 * Номер оголошений один раз: Viber хоче його з `+` у процентному кодуванні,
 * WhatsApp — без, і саме ця різниця форм і робила дублювання схожим на два різні
 * факти.
 */
const phone = '380937251208';

export const config = {
    telegramUrl: 'https://t.me/alik532',
    viberUrl: `viber://chat?number=%2B${phone}`,
    whatsappUrl: `https://wa.me/${phone}`,
    linkedinUrl: 'https://linkedin.com/in/alik-qa-engineer'
};
