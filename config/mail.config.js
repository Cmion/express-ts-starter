module.exports = {
  mailTrap: {
    port: process.env.MAIL_TRAP_PORT,
    user: process.env.MAIL_TRAP_USER,
    host: process.env.MAIL_TRAP_HOST,
    pass: process.env.MAIL_TRAP_PASS,
  },
  sendGrid: {
    port: 80,
  },
  mailSender: process.env.MAIL_SENDER
};
