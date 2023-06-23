import RSS from 'rss';

export function generateRSSFeedPopular(recommendations) {
    console.log(recommendations);
    const recommendationsArray = Array.from(recommendations);

    const feed = new RSS({
        title: 'Top 50 Products By Review PopularityFeed',
        description: 'Selection of top 50 popular products by number of reviews',
        feed_url: 'http://localhost:3000/popular.xml',
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
