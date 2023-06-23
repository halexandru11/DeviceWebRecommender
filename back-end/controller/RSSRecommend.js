import RSS from 'rss';

export function generateRSSFeed(recommendations) {
    console.log(recommendations);
    const recommendationsArray = Array.from(recommendations);

    const feed = new RSS({
        title: 'Top 50 Products Recommendation Feed',
        description: 'Latest recommendations',
        feed_url: 'http://localhost:3000/recommendations.xml',
        site_url: 'http://localhost:3000',
        pubDate: new Date(),
    });

    recommendationsArray.forEach((recommendation) => {
        feed.item({
            title: recommendation.name,
            description: recommendation.vendor_name,
            url: recommendation.url,
            pubDate: recommendation.date,
            author: 'Gimme Team',
            categories: ['Tech'],
        });
    });

    return feed.xml();
}
