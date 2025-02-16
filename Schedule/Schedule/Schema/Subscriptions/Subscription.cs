using HotChocolate.Execution;
using HotChocolate.Subscriptions;
using Schedule.DTOs;

namespace Schedule.Schema.Subscriptions;

public class Subscription
{
    private readonly ITopicEventReceiver _topicEventReceiver;

    public Subscription(ITopicEventReceiver topicEventReceiver)
    {
        _topicEventReceiver = topicEventReceiver;
    }
    
    [SubscribeAndResolve]
    public ValueTask<ISourceStream<LessonInfoDTO>> LessonInfoCreated(int groupId)
    {
        string topicName = $"{groupId}_{nameof(LessonInfoCreated)}";
        
        return _topicEventReceiver.SubscribeAsync<LessonInfoDTO>(topicName);
    }
}