const { SlashCommandBuilder } = require("discord.js");
const { load, save, hasModRole } = require("../utils/leaderboard");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removerank")
    .setDescription("Remove a user from the leaderboard by rank number (Moderator only)")
    .addIntegerOption(opt =>
      opt.setName("position").setDescription("Rank number to remove (e.g. 3)").setRequired(true).setMinValue(1)
    ),
  //
  async execute(interaction) {
    await interaction.deferReply();

    if (!hasModRole(interaction.member)) {
      return interaction.editReply("❌ You need the **Moderator** role to use this.");
    }

    const pos = interaction.options.getInteger("position");
    const lb = await load();

    if (pos > lb.length) {
      return interaction.editReply(`⚠️ There is no one at rank #${pos}. The leaderboard only has ${lb.length} entries.`);
    }

    const [removed] = lb.splice(pos - 1, 1);
    await save(lb);

    await interaction.editReply(`✅ Removed **${removed.name}** (rank #${pos}) from the leaderboard.`);
  }
};
