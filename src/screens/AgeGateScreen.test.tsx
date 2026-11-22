import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import { AgeGateScreen, CLOSE_AFTER_SECONDS, MINOR_MESSAGE } from './AgeGateScreen';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('age gate', () => {
  it('shows the question and both buttons', async () => {
    const r = await render(<AgeGateScreen onOver18={() => {}} onExit={() => {}} />);
    expect(r.getByText('Are you 18 or over?')).toBeTruthy();
    expect(r.getByText('I am Over 18')).toBeTruthy();
    expect(r.getByText('No, I am under 18')).toBeTruthy();
  });

  it('lets an adult continue', async () => {
    const onOver18 = jest.fn();
    const r = await render(<AgeGateScreen onOver18={onOver18} onExit={() => {}} />);
    await fireEvent.press(r.getByText('I am Over 18'));
    expect(onOver18).toHaveBeenCalledTimes(1);
  });

  it('shows the minors message when the player is under 18', async () => {
    const r = await render(<AgeGateScreen onOver18={() => {}} onExit={() => {}} />);
    await fireEvent.press(r.getByText('No, I am under 18'));
    expect(r.getByText(MINOR_MESSAGE)).toBeTruthy();
    expect(MINOR_MESSAGE).toBe('Minors are not allowed to play the game.');
  });

  it('does not let an under-18 player continue', async () => {
    const onOver18 = jest.fn();
    const r = await render(<AgeGateScreen onOver18={onOver18} onExit={() => {}} />);
    await fireEvent.press(r.getByText('No, I am under 18'));
    expect(r.queryByText('I am Over 18')).toBeNull();
    expect(onOver18).not.toHaveBeenCalled();
  });

  it('remembers an under-18 answer by calling onUnder18', async () => {
    const onUnder18 = jest.fn();
    const r = await render(<AgeGateScreen onOver18={() => {}} onUnder18={onUnder18} onExit={() => {}} />);
    await fireEvent.press(r.getByText('No, I am under 18'));
    expect(onUnder18).toHaveBeenCalledTimes(1);
  });

  it('starts at the minors message on a later launch and still closes the app', async () => {
    const onExit = jest.fn();
    const r = await render(<AgeGateScreen onOver18={() => {}} alreadyUnder18 onExit={onExit} />);
    expect(r.getByText(MINOR_MESSAGE)).toBeTruthy();
    for (let s = 1; s <= CLOSE_AFTER_SECONDS; s++) {
      await act(async () => {
        jest.advanceTimersByTime(1000);
      });
    }
    expect(onExit).toHaveBeenCalledTimes(1);
  });

  it('closes the app after 3 seconds, not before', async () => {
    const onExit = jest.fn();
    const r = await render(<AgeGateScreen onOver18={() => {}} onExit={onExit} />);
    await fireEvent.press(r.getByText('No, I am under 18'));

    // The countdown ticks once per second, so advance one second at a time.
    for (let s = 1; s < CLOSE_AFTER_SECONDS; s++) {
      await act(async () => {
        jest.advanceTimersByTime(1000);
      });
      expect(onExit).not.toHaveBeenCalled();
    }

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(onExit).toHaveBeenCalledTimes(1);
  });

  it('counts down on screen', async () => {
    const r = await render(<AgeGateScreen onOver18={() => {}} onExit={() => {}} />);
    await fireEvent.press(r.getByText('No, I am under 18'));
    expect(r.getByText('The app will close in 3 seconds.')).toBeTruthy();
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(r.getByText('The app will close in 2 seconds.')).toBeTruthy();
  });
});
