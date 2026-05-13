const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { load } = require("../utils/leaderboard");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("View the leaderboard"),

  async execute(interaction) {
    await interaction.deferReply();
    const lb = await load();

    if (lb.length === 0) {
      return interaction.editReply("The leaderboard is empty. Add users with `/add`.");
    }

    const medals = ["🥇", "🥈", "🥉"];

    const lines = await Promise.all(lb.map(async (entry, i) => {
      let displayName = entry.name;
      try {
        const member = await interaction.guild.members.fetch(entry.id);
        displayName = member.displayName;
      } catch {
        // user left the server or can't be fetched, fall back to stored name
      }
      const rank = medals[i] || `**#${i + 1}**`;
      return `${rank} ${displayName}`;
    }));

    const embed = new EmbedBuilder()
      .setTitle("🏆 Leaderboard")
      .setDescription(lines.join("\n"))
      .setColor(0xf5c518)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};
