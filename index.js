client.on('message', async (message) => {
    const msg = message.body.trim();

    if (msg.toLowerCase().startsWith('bug ')) {
        const bugContent = msg.slice(4).trim();

        if (!bugContent) {
            await message.reply('⚠️ Tafadhali andika maelezo ya bug baada ya neno "bug".');
            return;
        }

        // Accepted labels
        const allowedLabels = ['android', 'ios', 'web', 'desktop'];
        const labelMatch = bugContent.match(/([^]+)/i);

        let platformLabel = 'general'; // default
        let cleanDescription = bugContent;

        if (labelMatch) {
            platformLabel = labelMatch[1].toLowerCase().trim();
            cleanDescription = bugContent.replace(labelMatch[0], '').trim();

            if (!allowedLabels.includes(platformLabel)) {
                await message.reply(
                    `⚠️ Platform *"${platformLabel}"* haikubaliki.\n\nTafadhali tumia moja ya hizi: ${allowedLabels
                        .map((p) => `*${p}*`)
                        .join(', ')}\n\nMfano:\nbug [android] App haifunguki kwenye Android 12.`
                );
                return;
            }
        }

        const time = new Date().toLocaleString();
        const issueTitle = `Bug from ${message.from}`;
        const issueBody = `**Description:**\n${cleanDescription}\n\n**From:** ${message.from}\n**Time:** ${time}`;

        // Backup locally
        fs.appendFileSync('bug_reports.txt', `${issueTitle}\n${issueBody}\nPlatform: ${platformLabel}\n\n---\n`);

        try {
            const response = await axios.post(
                `https://api.github.com/repos/${process.env.GITHUB_REPO}/issues`,
                {
                    title: issueTitle,
                    body: issueBody,
                    labels: ['bug', platformLabel]
                },
                {
                    headers: {
                        Authorization: `token ${process.env.GITHUB_TOKEN}`,
                        Accept: 'application/vnd.github.v3+json'
                    }
                }
            );

            await message.reply(`✅ Bug yako imewasilishwa kwenye GitHub chini ya label *${platformLabel}*. Asante!`);
            console.log(`🪲 Bug submitted: ${response.data.html_url}`);
        } catch (error) {
            console.error('❌ Error sending to GitHub:', error.response?.data || error.message);
            await message.reply('❌ Imeshindikana kutuma bug kwenye GitHub. Tafadhali jaribu tena.');
        }
    }

    // Help command
    if (msg.toLowerCase() === 'help' || msg.toLowerCase() === 'bug') {
        await message.reply(
            `📌 Tuma bug kwa format:\n\n*bug [platform]* maelezo ya tatizo\n\n✅ Platforms zinazokubalika:\n*android*, *ios*, *web*, *desktop*\n\nMfano:\nbug [web] Login button haifanyi kazi`
        );
    }
});
